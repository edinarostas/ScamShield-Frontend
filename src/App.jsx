import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Messaging from './pages/Messaging/Messaging';
import Admin from './pages/Admin/Admin';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import './App.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/logout" element={<h1>Log out</h1>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
