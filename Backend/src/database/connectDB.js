import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async() =>{
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI,)
        if(conn){
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }

    } catch (error) {
        return console.log(`Error: ${error.message}`);
    }
}