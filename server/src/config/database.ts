import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, reuse the connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    console.log(`📦 Database: ${mongoose.connection.name || 'connected'}`);
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔑 MongoDB URI configured:', mongoURI.substring(0, 20) + '...');
    
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
    console.log(`📦 Database: ${mongoose.connection.name || mongoose.connection.db?.databaseName || 'connected'}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.error('💡 Make sure MONGODB_URI is set in Vercel environment variables');
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
