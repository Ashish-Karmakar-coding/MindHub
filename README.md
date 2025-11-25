# MindHub

A full-stack personal workspace application for managing notes, links, and files.

## Features

- 📝 **Notes Management** - Create, edit, and delete notes
- 🔗 **Links Management** - Save and organize important links
- 📁 **File Management** - Upload and organize files
- 📊 **Dashboard** - Overview of your workspace
- 🔐 **Authentication** - Secure user authentication with JWT
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router
- Axios
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (File Storage)
- Multer (File Upload)

## Project Structure

```
MindHub/
├── Frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Zustand stores
│   │   ├── pages/        # Page components
│   │   └── axios/        # API configuration
│   ├── vercel.json       # Vercel configuration
│   └── package.json
│
├── Backend/           # Express backend API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Express middlewares
│   │   └── utils/        # Utility functions
│   ├── vercel.json       # Vercel configuration (if using serverless)
│   └── package.json
│
└── DEPLOYMENT.md      # Deployment guide
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for file uploads)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindHub
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Set up Environment Variables**

   **Frontend** (`Frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

   **Backend** (`Backend/.env`):
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

   See `Frontend/ENV_SETUP.md` and `Backend/ENV_SETUP.md` for detailed instructions.

5. **Run the Development Servers**

   **Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. **Deploy Frontend:**
   ```bash
   cd Frontend
   vercel
   ```

2. **Set Environment Variables in Vercel:**
   - `VITE_API_URL` = Your backend API URL

3. **Deploy Backend** (to Railway, Render, or similar):
   - See DEPLOYMENT.md for backend deployment options

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/logout` - User logout
- `GET /api/users/check-user` - Check authenticated user
- `PUT /api/users/update` - Update user profile

### Notes
- `GET /api/notes/getNotes` - Get all notes
- `POST /api/notes/addNotes` - Create a note
- `PUT /api/notes/editNote/:id` - Update a note
- `DELETE /api/notes/deleteNote/:id` - Delete a note

### Links
- `GET /api/Links/get-link` - Get all links
- `POST /api/Links/add-link` - Create a link
- `DELETE /api/Links/delete-link/:linkId` - Delete a link

### Files
- `GET /api/files/getfiles` - Get all files
- `POST /api/files/upload` - Upload a file
- `DELETE /api/files/delete/:id` - Delete a file

### Folders
- `GET /api/folders/get-all-folders` - Get all folders
- `POST /api/folders/create-folder` - Create a folder
- `DELETE /api/folders/delete-folder/:folderId` - Delete a folder

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL

### Backend
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
