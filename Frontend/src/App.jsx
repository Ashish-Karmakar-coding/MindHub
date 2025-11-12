import { useAuthStore } from "./stores/authStore.js";

import { Signup } from "./pages/Signup.page.jsx"
import { Login } from "./pages/Login.Page.jsx"
import { Home } from "./pages/Home.page.jsx"
import { Dashboard } from "./pages/Dashboard.page.jsx";
import { Links } from "./pages/Links.page.jsx";
import { Notes } from "./pages/Notes.page.jsx";

function App() {

   const {authUser,checkAuth , isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth()
  },[]); 

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader className="w-10 h-10 animate-spin text-purple-700 " />
      </div>
    )
  }

  return (
    <>
    <Navbar/>
     <Routes>
        <Route path="/" element={authUser ? <Home />: <Navigate to="/signup"/>} />
        <Route path="/login" element={!authUser ?<Login  />: <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/"/>} />
        <Route path="/dashboard" element={authUser ? <Dashboard />: <Navigate to="/signup"/>} />
        <Route path="/links" element={authUser ? <Links />: <Navigate to="/signup"/>} />
        <Route path="/notes" element={authUser ? <Notes />: <Navigate to="/signup"/>} />
      </Routes>

    <Toaster/>

    </>
  );
}


export default App
