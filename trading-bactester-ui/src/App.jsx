//import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginSignup from "./components/loginSignup/loginSignup"
import Dashboard from './components/dashboard/dashboard'
import ProtectedRoute from './components/common/protectedRoute'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginSignup/>} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
