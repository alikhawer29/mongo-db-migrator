#!/usr/bin/env node

const { MongoClient } = require("mongodb");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function migrateDatabase({ sourceUri, targetUri, dbName, collectionName }) {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log("Connecting to source database...");
    await sourceClient.connect();
    console.log("Connected to source database.");

    // List all databases to help with debugging
    const admin = sourceClient.db().admin();
    const databases = await admin.listDatabases();
    console.log("Available databases on source:");
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
    });

    console.log("Connecting to target database...");
    await targetClient.connect();
    console.log("Connected to target database.");

    const sourceDb = sourceClient.db(dbName);
    const targetDb = targetClient.db(dbName);

    let collections = [];

    if (collectionName) {
      collections = [collectionName];
    } else {
      console.log("Fetching all collections from source database...");
      collections = await sourceDb.listCollections().toArray();
      collections = collections.map(col => col.name);
      console.log(`Found ${collections.length} collections: ${collections.join(', ')}`);
    }

    for (const collection of collections) {
      console.log(`\nMigrating collection: ${collection}`);
      
      const sourceCollection = sourceDb.collection(collection);
      const targetCollection = targetDb.collection(collection);

      // Get total documents count
      const totalDocs = await sourceCollection.countDocuments();
      console.log(`Total documents in ${collection}: ${totalDocs}`);

      if (totalDocs === 0) {
        console.log(`Collection ${collection} is empty, skipping...`);
        continue;
      }

      // Create cursor for batch processing
      const cursor = sourceCollection.find({});
      let processedDocs = 0;
      const batchSize = 1000;
      let batch = [];

      console.log("Starting migration...");
      
      for await (const doc of cursor) {
        batch.push(doc);
        processedDocs++;

        // Insert batch when it reaches batch size or when we finish
        if (batch.length === batchSize || processedDocs === totalDocs) {
          if (batch.length > 0) {
            await targetCollection.insertMany(batch);
            console.log(`Progress: ${processedDocs}/${totalDocs} documents (${Math.round((processedDocs/totalDocs)*100)}%)`);
            batch = [];
          }
        }
      }

      console.log(`✅ Successfully migrated ${processedDocs} documents from ${collection}`);
    }

    console.log("\n🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    rl.close();
  }
}

async function main() {
  console.log("=== MongoDB Database Migration Tool ===\n");

  try {
    const sourceUri = await question("Enter source MongoDB URI: ");
    const targetUri = await question("Enter target MongoDB URI: ");
    const dbName = await question("Enter database name: ");
    const collectionInput = await question("Enter collection name (leave empty for all collections): ");
    
    const collectionName = collectionInput.trim() === '' ? null : collectionInput.trim();

    console.log("\nStarting migration...");
    console.log(`Source: ${sourceUri}`);
    console.log(`Target: ${targetUri}`);
    console.log(`Database: ${dbName}`);
    console.log(`Collection: ${collectionName || 'All collections'}`);
    console.log("\n" + "=".repeat(50));

    await migrateDatabase({ sourceUri, targetUri, dbName, collectionName });

  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
  }
}

// Also support command line arguments
if (process.argv.length > 2) {
  const [, , sourceUri, targetUri, dbName, collectionName] = process.argv;
  migrateDatabase({ sourceUri, targetUri, dbName, collectionName: collectionName || null });
} else {
  main();
}
