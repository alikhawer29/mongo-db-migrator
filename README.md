# Mongo DB Migrator

A powerful Node.js command-line tool for migrating MongoDB databases between servers. Perfect for copying production data to local development, server-to-server migrations, and database backups.

## 🚀 Features

- ✅ **Full Database Migration** - Migrate all collections from a database
- ✅ **Single Collection Migration** - Migrate specific collections only
- ✅ **Remote & Local MongoDB Support** - Works with any MongoDB instance
- ✅ **Real-time Progress Tracking** - See migration progress as it happens
- ✅ **Batch Processing** - Efficiently handles large datasets
- ✅ **Error Handling** - Robust error reporting and connection management
- ✅ **CLI Interactive Mode** - User-friendly prompts
- ✅ **Command Line Arguments** - Scriptable for automation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/alikhawer29/mongo-db-migrator
cd mongo-db-migrator

# Install dependencies
npm install

# Make the script executable (optional)
chmod +x migrate.js
```

## 🛠️ Usage

### Interactive Mode (Recommended)

```bash
npm run migrate
```

This will prompt you for:
- Source MongoDB URI
- Target MongoDB URI
- Database name
- Collection name (optional - leave empty for all collections)

### Command Line Arguments

```bash
node migrate.js "source-uri" "target-uri" "database-name" "collection-name"
```

### Examples

#### Migrate Entire Database
```bash
npm run migrate
# Follow prompts to enter connection details
```

#### Migrate Specific Collection
```bash
node migrate.js "mongodb://admin:password@source.com:27017/" "mongodb://target.com:27017/" "mydb" "users"
```

#### Production to Local Development
```bash
node migrate.js "mongodb://admin:password@source-mongodb.com:27017/" "mongodb://localhost:27017/" "mydb" ""
```

## 📋 MongoDB URI Format

```
mongodb://[username:password@]host[:port]/[database]
```

### Examples:
- **Local**: `mongodb://localhost:27017/`
- **With Auth**: `mongodb://admin:password@host:27017/`
- **Atlas Cloud**: `mongodb://user:pass@cluster.mongodb.net/`

## 🎯 Recent Migration Success

The tool successfully migrated a production database with 21 collections:

```
📊 Migration Summary:
- Source: source-mongodb.com:27017
- Target: target-mongodb.com:28028
- Database: ltest
- Collections: 21 total
- Documents: 323 migrated
- Duration: ~2 minutes
```

### Collections Migrated:
- `users` (45 documents)
- `notifications` (114 documents)
- `payments` (26 documents)
- `chatmessages` (27 documents)
- `bookings` (26 documents)
- And 16 more collections...

## 🔧 Configuration

No configuration required! The tool works out of the box. Simply provide the MongoDB connection URIs when prompted.

## 🚨 Requirements

- Node.js 14+ 
- MongoDB Node.js Driver (included)
- Access to source and target MongoDB databases

## 🐛 Troubleshooting

### "Found 0 collections"
- Check database name spelling (case-sensitive)
- Verify database exists on source server
- Ensure proper authentication credentials

### Connection Issues
- Verify MongoDB URI format
- Check network connectivity
- Ensure MongoDB is running on target server
- Validate username/password credentials

### Large Databases
- Tool uses batch processing (1000 documents per batch)
- Progress is shown in real-time
- Handles millions of documents efficiently

## 📝 Development

### Project Structure
```
mongo-db-migrator/
├── migrate.js              # Main CLI migration script
├── package.json            # Dependencies and scripts
├── server/                 # Optional Express server
│   ├── services/
│   │   └── migrateService.js
│   └── routes/
│       └── migrateRoutes.js
└── README.md               # This file
```

### Scripts
- `npm run migrate` - Run migration tool
- `npm run dev` - Start Express server (optional)
- `npm start` - Start Express server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - Feel free to use this tool in your projects!

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your MongoDB connection strings
3. Ensure proper database permissions
4. Test with small collections first

---

**Built with ❤️ by Khawer Ali using Node.js and MongoDB Driver**

Perfect for developers who need to migrate databases between environments quickly and safely!
