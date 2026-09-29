import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('❌ MONGO_URI environment variable is not set!');
        console.error('   Set it in your .env file or Render dashboard.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(mongoUri.replace(/['"]/g, '').trim());
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
