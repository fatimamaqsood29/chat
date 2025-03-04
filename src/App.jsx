import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import ProfileScreen from './pages/ProfileScreen';
import Home from './pages/Home';
import { ThemeProviderWrapper } from './ThemeContext';
import EditProfileScreen from './pages/EditProfileScreen';
import SearchScreen from './pages/SearchScreen';
import CreateScreen from './pages/CreateScreen';
import ExplorerScreen from './pages/ExplorerScreen';
import NotificationsScreen from './pages/NotificationsScreen';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Paths where Navbar should be hidden
  const hideNavbarRoutes = ['/', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Sidebar Navbar */}
      {!hideNavbar && (
        <div className="w-full md:w-64 md:h-screen fixed md:left-0 bg-gray-100 dark:bg-gray-900 z-10">
          <Navbar setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen} />
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 md:left-20 w-full md:w-96 h-screen border-r p-4 bg-white z-50 shadow-md dark:bg-gray-800">
          <SearchScreen onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-grow p-4 transition-all ${
          isSearchOpen ? 'md:ml-96' : hideNavbar ? 'ml-0' : 'md:ml-64'
        }`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explorer" element={<ExplorerScreen />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/profile/:userId" element={<ProfileScreen />} />
          <Route path="/edit-profile" element={<EditProfileScreen />} />
          <Route path="/create" element={<CreateScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProviderWrapper>
        <Router>
          <AppContent />
        </Router>
      </ThemeProviderWrapper>
    </Provider>
  );
}
