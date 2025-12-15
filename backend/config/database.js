import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomify';

    // Only enable TLS when connecting to Atlas (mongodb.net) or when explicitly requested
    const isAtlas = mongoUri.includes('mongodb.net');
    const shouldUseTls = isAtlas || process.env.MONGODB_TLS === 'true';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB || undefined,
      ...(shouldUseTls ? { tls: true } : {}),
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
