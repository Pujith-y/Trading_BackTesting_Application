//import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginSignup from "./components/loginSignup/loginSignup"
import Dashboard from './pages/dashboard'
import ProtectedRoute from './components/common/protectedRoute'
import Strategies from './pages/strategies'



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
        <Route path='/strategies' element={
          <ProtectedRoute>
            <Strategies />
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
