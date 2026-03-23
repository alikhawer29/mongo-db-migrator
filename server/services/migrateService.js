const { MongoClient } = require("mongodb");

async function migrateDatabase({
    sourceUri,
    targetUri,
    dbName,
    collectionName,
    io
}) {
    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);

    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db(dbName);
    const targetDb = targetClient.db(dbName);

    let collections = [];

    if (collectionName) {
        collections = [collectionName];
    } else {
        const list = await sourceDb.listCollections().toArray();
        collections = list.map(c => c.name);
    }

    for (const name of collections) {
        const sourceCollection = sourceDb.collection(name);
        const targetCollection = targetDb.collection(name);

        const docs = await sourceCollection.find({}).toArray();

        if (docs.length) {
            await targetCollection.insertMany(docs);
        }

        if (io) {
            io.emit("progress", {
                collection: name,
                count: docs.length
            });
        }

        console.log(`Migrated ${name}: ${docs.length} records`);
    }

    await sourceClient.close();
    await targetClient.close();
}

module.exports = { migrateDatabase };