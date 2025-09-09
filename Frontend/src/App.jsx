import { useState } from 'react'
import './App.css'
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'
import Navbar from './components/navbar.jsx'
import Sidebar from './components/sidebar.jsx'

function App() {

  return (
    <>
    <Navbar />
      {/* <Signup /> */}
      <Login />
      <Sidebar/>
    </>
  )
}

export default App
