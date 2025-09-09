import { useState } from 'react'
import './App.css'
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'
import Navbar from './components/navbar.jsx'

function App() {

  return (
    <>
    <Navbar />
      <Signup />
      {/* <Login /> */}
    </>
  )
}

export default App
