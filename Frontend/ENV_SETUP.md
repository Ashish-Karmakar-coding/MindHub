# Frontend Environment Variables

Create a `.env` file in the `Frontend` directory with the following:

```env
# API URL - Set this to your backend API URL
# For local development: http://localhost:3000/api
# For production: https://your-backend-domain.com/api
VITE_API_URL=http://localhost:3000/api
```

## For Vercel Deployment

Add this as an environment variable in Vercel dashboard:
- Variable name: `VITE_API_URL`
- Value: `https://your-backend-url.com/api`

