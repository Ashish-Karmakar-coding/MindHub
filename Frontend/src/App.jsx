import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { useEffect } from 'react'
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'
import Sidebar from './components/sidebar.jsx'
import Files from "./pages/File.page.jsx";
import Dashboard from './pages/Dashboard.page.jsx'
import Link from "./pages/Link.page.jsx";
import Notes from './pages/Notes.page.jsx'
import { useAuthStore } from './lib/authStore.js'

function App() {
  const { authUser, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth()
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      {/* Left Column - Sidebar */}
      <div className="h-screen">
        {authUser && <Sidebar />}
      </div>
      
      {/* Right Column - Pages */}
      <div className="h-screen overflow-auto bg-gray-900">
        <Routes>
          <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/signup" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/notes" element={authUser ? <Notes /> : <Navigate to="/signup" />} />
          <Route path="/links" element={authUser ? <Link /> : <Navigate to="/signup" />} />
          <Route path="/files" element={authUser ? <Files /> : <Navigate to="/signup" />} />

        </Routes>
      </div>
    </div>
  )
}

export default App