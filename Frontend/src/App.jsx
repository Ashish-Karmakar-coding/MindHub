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
  }, [checkAuth]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar - Only shown when authenticated */}
      {authUser && <Sidebar />}
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 h-screen overflow-auto transition-all duration-300 ${
          authUser ? 'ml-16' : 'ml-0'
        }`}
      >
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