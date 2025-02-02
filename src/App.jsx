import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Follow from './pages/Follow';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import { ThemeProviderWrapper } from './ThemeContext';

export default function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/follow" element={<Follow />} />
          <Route path="/chat/:userId" element={<Chat />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}