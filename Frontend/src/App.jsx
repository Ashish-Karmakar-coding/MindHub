import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore.js";
import { Signup } from "./pages/Signup.page.jsx"
import { Login } from "./pages/Login.Page.jsx"
import { Dashboard } from "./pages/Dashboard.page.jsx";
import { Links } from "./pages/Links.page.jsx";
import { Notes } from "./pages/Notes.page.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader className="w-10 h-10 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {authUser ? (
        <div className="flex min-h-screen bg-gray-900">
          <Sidebar />
          <div className="flex-1 ml-20 sm:ml-20 lg:ml-64">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/links" element={<Links />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
