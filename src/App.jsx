import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviePage from './pages/MoviePage';
import BookingPage from './pages/BookingPage';
import Favorites from './components/Favorites';
import MyBookings from './components/MyBookings';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

// Wrapper component to use useLocation
const AppWrapper = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  // Hide Navbar on login and register pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar darkMode={darkMode} onToggleTheme={toggleDarkMode} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home darkMode={darkMode} />} />
        <Route path="/movie/:id" element={<MoviePage darkMode={darkMode} />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/favorites" element={<Favorites darkMode={darkMode} />} />
        <Route path="/my-bookings" element={<MyBookings darkMode={darkMode} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;
