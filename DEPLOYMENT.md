# Deployment Guide for MindHub

This guide will help you deploy the MindHub application to Vercel.

## Prerequisites

- Node.js installed
- MongoDB database (MongoDB Atlas recommended for production)
- Cloudinary account (for file uploads)
- Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)

## Project Structure

```
MindHub/
├── Frontend/     # React + Vite frontend
└── Backend/      # Express.js backend
```

## Deployment Options

### Option 1: Deploy Frontend to Vercel, Backend Separately (Recommended)

This is the recommended approach as Vercel is optimized for frontend deployments.

#### Step 1: Deploy Backend

You can deploy the backend to:
- **Railway** (recommended for Node.js apps)
- **Render**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS/Google Cloud/Azure**

**Example: Deploying to Railway**

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `Backend` folder
5. Add environment variables (see Backend/.env.example)
6. Deploy

**Backend Environment Variables:**
```
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional, you can also use the web interface):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   
   Or use the Vercel web interface:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Set Root Directory to `Frontend`
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Add Environment Variables in Vercel:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```

5. **Redeploy** after adding environment variables

### Option 2: Deploy Both to Vercel (Serverless Functions)

If you want to deploy the backend as Vercel serverless functions:

1. **Update Backend Structure:**
   - Move backend code to `api/` folder in root
   - Convert routes to serverless functions

2. **Deploy:**
   ```bash
   vercel
   ```

**Note:** This approach requires restructuring the backend code for serverless functions.

## Environment Variables Setup

### Frontend (.env or Vercel Environment Variables)

```env
VITE_API_URL=https://your-backend-api.com/api
```

### Backend (.env or hosting platform environment variables)

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_strong_secret_key_here_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs in production)
5. Get connection string and replace `<password>` with your password
6. Add connection string to backend environment variables

## Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add to backend environment variables

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend environment variable `VITE_API_URL` is set correctly
- [ ] Backend CORS is configured to allow frontend domain
- [ ] MongoDB connection is working
- [ ] Cloudinary is configured
- [ ] JWT_SECRET is set to a strong random string
- [ ] Test authentication (signup/login)
- [ ] Test CRUD operations (notes, links)
- [ ] Test file uploads (if applicable)

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check that `FRONTEND_URL` in backend includes your Vercel frontend URL
2. Ensure backend CORS configuration allows your frontend domain
3. Check that credentials are enabled in both frontend and backend

### API Connection Issues

1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check that backend is running and accessible
3. Test backend API directly with curl or Postman
4. Check browser console for specific error messages

### Build Errors

1. Ensure all dependencies are in `package.json`
2. Check Node.js version compatibility
3. Review build logs in Vercel dashboard

## Local Development

For local development:

1. **Backend:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd Frontend
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run dev
   ```

## Production URLs

After deployment, update:
- Backend `FRONTEND_URL` with your Vercel frontend URL
- Frontend `VITE_API_URL` with your backend API URL

## Security Notes

- Never commit `.env` files to Git
- Use strong, random JWT secrets
- Enable HTTPS for all production deployments
- Regularly update dependencies
- Use environment variables for all sensitive data

