import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://admin:priyamadhu@cluster0.t47mua7.mongodb.net/cms?authSource=admin&retryWrites=true&w=majority';

const connectDB = async () => {
    let mongoUri = (process.env.MONGO_URI || DEFAULT_URI).replace(/['"]/g, '').trim().replace(/\s+/g, '');
    if (!mongoUri.includes('authSource=')) {
        mongoUri += mongoUri.includes('?') ? '&authSource=admin' : '?authSource=admin';
    }
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`⚠️ Primary Connection Error (${error.message}). Reconnecting to verified Atlas URI...`);
        try {
            await mongoose.disconnect();
            const conn = await mongoose.connect(DEFAULT_URI);
            console.log(`✅ MongoDB Fallback Connected: ${conn.connection.host}/${conn.connection.name}`);
        } catch (fallbackErr) {
            console.error(`❌ MongoDB Connection Error: ${fallbackErr.message}`);
        }
    }
};

export default connectDB;
