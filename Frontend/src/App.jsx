import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'
import Navbar from './components/navbar.jsx'
import Sidebar from './components/sidebar.jsx'
import Dashboard from './pages/Dashboard.page.jsx'
import Notes from './pages/Notes.page.jsx'

  import {authUser} from './lib/authStore.js'

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={authUser ? <Dashboard />: <Navigate to="/signup"/>} />
        <Route path="/login" element={!authUser ?<Login />: <Navigate to="/"/>} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/"/>} />
        <Route path="/notes" element={authUser ? <Notes />: <Navigate to="/signup"/>} />
        {/* <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/signup"/>} /> */}
      </Routes>
      {/* <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Dashboard />} />
      </Routes> */}
    </Router>
  )
}

export default App