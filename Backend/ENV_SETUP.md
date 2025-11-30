# Backend Environment Variables

Create a `.env` file in the `Backend` directory with the following:

```env
# Server Port
PORT=3000

# MongoDB Connection String (supports both MONGODB_URI and MONGO_URI)
MONGODB_URI=your_mongodb_connection_string
# Alternative variable name (also supported):
# MONGO_URI=your_mongodb_connection_string

# JWT Secret Key (use a strong random string in production)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS) - can be comma-separated for multiple URLs
FRONTEND_URL=http://localhost:5173
```

## For Production Deployment

When deploying to Railway, Render, or other platforms, add these as environment variables:

- `PORT` - Usually set automatically by the platform
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong random string (minimum 32 characters)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `FRONTEND_URL` - Your frontend URL (e.g., https://your-app.vercel.app)

