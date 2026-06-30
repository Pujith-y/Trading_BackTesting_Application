//import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginSignup from "./components/loginSignup/loginSignup"


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginSignup/>} />
      </Routes>
    </>
  )
}

export default App
