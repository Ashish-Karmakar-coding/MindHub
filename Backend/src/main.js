import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

// Serve static files from React app in production
if(process.env.NODE_ENV === "production"){
  // Try multiple possible paths for the frontend dist folder
  const possiblePaths = [
    path.join(__dirname, '../../Frontend/dist'),  // Local development structure
    path.join(__dirname, '../Frontend/dist'),     // Alternative structure
    path.join(process.cwd(), 'Frontend/dist'),    // From project root
    path.join(process.cwd(), 'frontend/dist'),    // Lowercase variant
  ];
  
  let staticPath = possiblePaths[0];
  
  // Find the first path that exists
  for (const testPath of possiblePaths) {
    try {
      if (fs.existsSync(testPath)) {
        staticPath = testPath;
        console.log(`Serving static files from: ${staticPath}`);
        break;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  // Serve static files from the React app
  app.use(express.static(staticPath));
  
  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(staticPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
}

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}....`);
})