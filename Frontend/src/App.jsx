import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore.js";
import { Signup } from "./pages/Signup.page.jsx";
import { Login } from "./pages/Login.Page.jsx";
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-base)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            border: "3px solid var(--border-primary)",
            borderTop: "3px solid var(--accent-yellow)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "2px solid var(--border-primary)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            boxShadow: "3px 3px 0px var(--accent-yellow)",
            borderRadius: "0",
          },
          success: {
            iconTheme: {
              primary: "var(--accent-yellow)",
              secondary: "#000000",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--accent-coral)",
              secondary: "#ffffff",
            },
          },
        }}
      />
      {authUser ? (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
          <Sidebar />
          {/* Content area — offset for sidebar on desktop */}
          <div
            style={{
              flex: 1,
              marginLeft: 0,
              paddingTop: "60px",
              width: "100%",
            }}
            className="main-content"
          >
            <style>{`
              @media (min-width: 1024px) {
                .main-content { margin-left: 72px; padding-top: 0 !important; }
              }
              @media (min-width: 1280px) {
                .main-content { margin-left: 260px; }
              }
            `}</style>
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
