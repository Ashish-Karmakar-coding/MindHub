import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './database/connectDB.js';
import userRouter from './routes/users.route.js';
import linksRouter from './routes/links.router.js';
import notesRouter from './routes/notes.router.js';
import fileRouter from './routes/files.router.js';
import folderRouter from './routes/folder.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));                                                                                                       

app.use(express.json());
app.use(cookieParser());

app.use("/api/users",userRouter)
app.use("/api/Links",linksRouter)
app.use("/api/notes",notesRouter)
app.use("/api/files",fileRouter)
app.use("/api/folders",folderRouter)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '../../frontend/dist')))
    // ✅ Fixed: Added parameter name to wildcard route
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname,"..","../frontend","dist","index.html"));
    });
}

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}....`);
})