import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.route.js';
import { connectDB } from './database/connectDB.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users",userRouter)


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}....`);
})