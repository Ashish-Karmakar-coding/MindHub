import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnecting = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2 || isConnecting) {
    return;
  }

  try {
    isConnecting = true;
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MongoDB connection string is not defined');
    }

    const conn = await mongoose.connect(uri);

    if (conn) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  } finally {
    isConnecting = false;
  }
};