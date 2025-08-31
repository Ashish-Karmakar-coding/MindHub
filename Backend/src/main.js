import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.route.js';


dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users",userRouter)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}....`);
})