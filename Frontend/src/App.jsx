import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore.js";
import { Signup } from "./pages/Signup.page.jsx";
import { Login } from "./pages/Login.Page.jsx";
import { Dashboard } from "./pages/Dashboard.page.jsx";
import { Links } from "./pages/Links.page.jsx";
import { Notes } from "./pages/Notes.page.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111317] flex-col gap-4">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#c0c1ff] rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#94a3b8]">
          Initializing MindHub Core...
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1c1f",
            color: "#e2e2e6",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#4edea3",
              secondary: "#0c0e11",
            },
          },
          error: {
            iconTheme: {
              primary: "#ffb4ab",
              secondary: "#0c0e11",
            },
          },
        }}
      />
      {authUser ? (
        <div className="min-h-screen bg-[#111317] flex">
          <Sidebar />

          {/* Main Area */}
          <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
            {/* Top Tactical Status Header */}
            <header className="h-14 bg-[#111317]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-6">
              <div className="flex items-center gap-2 pl-10 lg:pl-0">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                <span className="text-[11px] font-mono text-[#94a3b8] tracking-wider uppercase hidden sm:inline">
                  Synapse Active • Local-First Memory
                </span>
                <span className="text-[11px] font-mono text-[#94a3b8] tracking-wider uppercase sm:hidden">
                  MindHub Core
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a1c1f] text-[11px] font-mono text-[#94a3b8] border border-white/5">
                  <span className="text-[#4edea3]">●</span>
                  <span>TLS 1.3 • Zero-Loss Storage</span>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 w-full bg-[#111317]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/links" element={<Links />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
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
