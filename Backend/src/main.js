import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './database/connectDB.js';
import userRouter from './routes/users.route.js';
import linksRouter from './routes/links.router.js';
import notesRouter from './routes/notes.router.js';
import fileRouter from './routes/files.router.js';
import folderRouter from './routes/folder.router.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));                                                                                                          

app.use(express.json());
app.use(cookieParser());

app.use("/api/users",userRouter)
app.use("/api/Links",linksRouter)
app.use("/api/notes",notesRouter)
app.use("/api/files",fileRouter)
app.use("/api/folders",folderRouter)


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}....`);
})