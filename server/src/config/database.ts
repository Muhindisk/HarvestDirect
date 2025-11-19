import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, reuse the connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/harvestdirect';
    
    await mongoose.connect(mongoURI, {
      // Connection pool size
      maxPoolSize: 10,
      minPoolSize: 2,
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Auto-index management
      autoIndex: process.env.NODE_ENV === 'development',
      
      // Buffering settings for serverless
      bufferCommands: false,
    });
    
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    isConnected = false;
    
    // Don't exit process in serverless environment
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB Reconnected');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
  isConnected = false;
});
