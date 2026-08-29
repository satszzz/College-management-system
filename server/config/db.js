import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const rawUri = process.env.MONGO_URI || 'mongodb+srv://admin:priyamadhu@cluster0.t47mua7.mongodb.net/cms?retryWrites=true&w=majority';
        const mongoUri = rawUri.replace(/\s+/g, '');
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
