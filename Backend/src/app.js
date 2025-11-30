import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.route.js';
import linksRouter from './routes/links.router.js';
import notesRouter from './routes/notes.router.js';
import fileRouter from './routes/files.router.js';
import folderRouter from './routes/folder.router.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === 'development'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/Links', linksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/files', fileRouter);
app.use('/api/folders', folderRouter);

export default app;


