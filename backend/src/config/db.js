const mongoose = require('mongoose');

let mongod = null;

/**
 * Connect to MongoDB database.
 * If local MongoDB is not reachable, automatically falls back to an embedded in-memory MongoDB
 * so the application works seamlessly out-of-the-box without manual MongoDB installation.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_task_db';

  try {
    // Attempt connecting to the configured URI with a quick 2-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`\x1b[32m[MongoDB Connected]\x1b[0m Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`\x1b[33m[Notice]\x1b[0m Local MongoDB at ${uri} is not reachable.`);
    console.log('\x1b[36m[Auto-Fallback]\x1b[0m Starting embedded in-memory MongoDB server for instant zero-config setup...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`\x1b[32m[MongoDB In-Memory Connected]\x1b[0m Database running in-memory: ${conn.connection.name}`);
      console.log('\x1b[32m✔ Application is ready to use! No local MongoDB installation required.\x1b[0m');
      console.log('\x1b[33m💡 Tip: To persist data across restarts, add a free MongoDB Atlas cloud URI to backend/.env\x1b[0m');
      return conn;
    } catch (fallbackError) {
      console.error(`\x1b[31m[MongoDB Fallback Error]\x1b[0m ${fallbackError.message}`);
      console.log('Please ensure MongoDB is running or configure MONGO_URI in backend/.env');
    }
  }
};

// Cleanup on server exit
process.on('SIGINT', async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
  process.exit(0);
});

module.exports = connectDB;
