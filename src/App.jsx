import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Messaging from './pages/Messaging/Messaging';
import Admin from './pages/Admin/Admin';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Authentication from './components/Authentication/Authentication';
import './App.scss'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
  };

  return (

    <BrowserRouter>
      {isLoggedIn && <Header />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Authentication onLoginSuccess={handleSuccessfulLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/logout" element={<h1>Log out</h1>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {isLoggedIn && <Footer />}
    </BrowserRouter>
  );
}

export default App;
