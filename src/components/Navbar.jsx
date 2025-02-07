import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaComments, FaSun, FaMoon, FaUser, FaHome } from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <nav className={`shadow-lg ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* App Logo */}
        <Link to="/" className="text-xl font-bold">
          SocialApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center hover:text-blue-500">
            <FaHome className="mr-2" /> Home
          </Link>
          <Link to="/follow" className="flex items-center hover:text-blue-500">
            <FaUserFriends className="mr-2" /> Follow
          </Link>
          <Link to="/second" className="flex items-center hover:text-blue-500">
            <FaUserFriends className="mr-2" /> Second
          </Link>

          <Link to="/chat" className="flex items-center hover:text-blue-500">
            <FaComments className="mr-2" /> Chat
          </Link>
          <Link to="/profile" className="flex items-center hover:text-blue-500">
            <FaUser className="mr-2" /> Profile
          </Link>
          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="focus:outline-none">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}