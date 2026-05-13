import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define MONGO_URI');
}

// global cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

const connectDB = async () => {

    // already connected
    if (cached.conn) {
        console.log('Using cached connection');
        return cached.conn;
    }

    // first connection
    if (!cached.promise) {

        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            return mongoose;
        });

    }

    cached.conn = await cached.promise;

    console.log('MongoDB connected');

    return cached.conn;
};

export default connectDB;