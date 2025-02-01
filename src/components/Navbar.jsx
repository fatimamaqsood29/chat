import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserFriends, FaComments, FaSun, FaMoon } from 'react-icons/fa';

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check the system's theme preference and set initial state
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

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
            <h1 class="font-poppins">This headline will use Poppins.</h1>

          </Link>
          
        </div>
      </div>
    </nav>
  );
}