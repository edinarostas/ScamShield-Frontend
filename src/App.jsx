import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Messaging from './pages/Messaging/Messaging';
import Admin from './pages/Admin/Admin';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Authentication from './components/Authentication/Authentication';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import useToken from './utils/useToken';
import './App.scss'

const App = () => {
  const { setToken, clearToken } = useToken();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  if (!token) {
    return <Authentication setToken={setToken} />
  }

  return (
    <div>
      {token ? (
        <>
          <Header handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<ProtectedRoute token={token}><Home /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute token={token}><Home /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute token={token}><Messaging /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute token={token}><Admin /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Authentication setToken={setToken} />} />
          <Route path="*" element={<Authentication setToken={setToken} />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
