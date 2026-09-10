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

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const cleanOrigin = origin ? origin.replace(/\/$/, '') : origin;
    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Connect to DB on first request (serverless-friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/users', userRouter);
app.use('/api/Links', linksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/files', fileRouter);
app.use('/api/folders', folderRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Only start server in non-serverless environments (local dev)
const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}....`);
  });
}

export default app;