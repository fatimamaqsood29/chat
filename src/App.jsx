import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import Follow from './pages/Follow';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import ProfileScreen from './pages/ProfileScreen';
import Home from './pages/Home';
import { ThemeProviderWrapper } from './ThemeContext';
import EditProfileScreen from './pages/EditProfileScreen';
import SearchScreen from './pages/SearchScreen';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProviderWrapper>
      <Router>
        <div className="min-h-screen flex">
          {/* Navigation Bar */}
          <div className="w-64 h-screen fixed left-0">
            <Navbar setIsSearchOpen={setIsSearchOpen} />
          </div>

          {/* Search Column */}
          {isSearchOpen && (
            <div className="w-96 h-screen border-l border-r p-4">
              <SearchScreen onClose={() => setIsSearchOpen(false)} />
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-grow p-4 ${isSearchOpen ? 'ml-96' : 'ml-64'}`}>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/follow" element={<Follow />} />
              <Route path="/chat/:userId" element={<Chat />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/edit-profile" element={<EditProfileScreen />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProviderWrapper>
  );
}