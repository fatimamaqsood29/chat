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
import CreateScreen from './pages/CreateScreen'; // Import the CreatePost component

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ThemeProviderWrapper>
      <Router>
        <div className="min-h-screen flex relative">
          {/* Fixed Navigation Bar */}
          <div className="w-64 h-screen fixed left-0 bg-gray-100 dark:bg-gray-900">
            <Navbar
              setIsSearchOpen={setIsSearchOpen}
              isSearchOpen={isSearchOpen}
            />
          </div>

          {/* Search Overlay */}
          {isSearchOpen && (
            <div className="fixed top-0 left-20 w-96 h-screen border-r p-4 bg-white z-50 shadow-md dark:bg-gray-800">
              <SearchScreen onClose={() => setIsSearchOpen(false)} />
            </div>
          )}

          {/* Main Content Area */}
          <div
            className={`flex-grow p-4 ${
              isSearchOpen ? 'ml-96' : 'ml-64'
            } transition-all`}
          >
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/follow" element={<Follow />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/edit-profile" element={<EditProfileScreen />} />
              <Route path="/create" element={<CreateScreen />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProviderWrapper>
  );
}