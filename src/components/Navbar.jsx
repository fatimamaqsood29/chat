import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserFriends, FaComments, FaSun, FaMoon } from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
          SocialApp
        </Link>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="text-gray-700 dark:text-white">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/follow" className="flex items-center text-gray-700 dark:text-white hover:text-blue-500">
            <FaUserFriends className="mr-2" /> Follow
          </Link>
          <Link to="/chat" className="flex items-center text-gray-700 dark:text-white hover:text-blue-500">
            <FaComments className="mr-2" /> Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}