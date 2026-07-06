//import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginSignup from "./components/loginSignup/loginSignup"
import Dashboard from './components/dashboard/dashboard'
import ProtectedRoute from './components/common/protectedRoute'
import Strategies from './pages/strategies'
import NewStrategy from './pages/NewStrategy'


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
        <Route path='/strategies/new' element={
          <ProtectedRoute>
            <NewStrategy />
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
