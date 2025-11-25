# Quick Deploy Guide - Vercel

## 🚀 Deploy Frontend to Vercel (5 minutes)

### Method 1: Using Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose production deployment when asked

5. **Set Environment Variable:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Redeploy

### Method 2: Using Vercel Web Interface

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure:**
   - Root Directory: `Frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
5. **Add Environment Variable:**
   - `VITE_API_URL` = `https://your-backend-url.com/api`
6. **Click Deploy**

## 🔧 Deploy Backend (Recommended: Railway)

### Railway Deployment (Easiest)

1. **Go to [railway.app](https://railway.app)**
2. **Create New Project**
3. **Deploy from GitHub**
4. **Select Backend folder**
5. **Add Environment Variables:**
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. **Deploy**

### Alternative: Render

1. **Go to [render.com](https://render.com)**
2. **New Web Service**
3. **Connect GitHub repository**
4. **Configure:**
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (same as Railway)
6. **Deploy**

## ✅ Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` includes Vercel frontend URL
- [ ] MongoDB connection working
- [ ] Test signup/login
- [ ] Test creating notes/links

## 🔗 Update URLs

After deployment, update:

1. **Frontend Environment Variable in Vercel:**
   - `VITE_API_URL` = `https://your-backend.railway.app/api` (or your backend URL)

2. **Backend Environment Variable:**
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`

3. **Redeploy both** after updating environment variables

## 🐛 Troubleshooting

**CORS Errors?**
- Check `FRONTEND_URL` in backend includes your Vercel URL
- Ensure backend CORS allows your frontend domain

**API Not Connecting?**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Test backend API directly: `https://your-backend.com/api/users/check-user`

**Build Failing?**
- Check Node.js version (should be 18+)
- Review build logs in Vercel dashboard
- Ensure all dependencies are in package.json

## 📚 Need More Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

