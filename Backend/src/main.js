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

// CORS configuration - supports both development and production
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, './../Frontend/dist')))
  // ✅ Fixed: Added parameter name to wildcard route
  app.get('/files{/*path}', (req, res) => {
      res.sendFile(path.join(__dirname, "./../Frontend","dist","index.html"));
  });
}

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}....`);
})