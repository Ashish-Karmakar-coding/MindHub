import multer from 'multer';

// Use memory storage for serverless (Vercel) compatibility
// Files are stored in memory buffer and streamed directly to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
