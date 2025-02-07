import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Login from './components/Login';
import Signup from './components/Signup';
import Follow from './pages/Follow';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import ProfileScreen from './components/ProfileScreen';
import Second from './components/Second';
import Home from './pages/Home'; // Import Home component
import { ThemeProviderWrapper } from './ThemeContext';

export default function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <div className="min-h-screen">
          {/* Navigation Bar */}
          <Navbar />
          {/* Toast notifications */}
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home route */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/follow" element={<Follow />} />
            <Route path="/second" element={<Second />} />

            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </div>
      </Router>
    </ThemeProviderWrapper>
  );
}