import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaComments,
  FaSun,
  FaMoon,
  FaUser,
  FaHome,
  FaSearch,
  FaBars,
  FaCog,
  FaBookmark,
  FaSignOutAlt,
  FaPlus,
  FaExchangeAlt,
} from 'react-icons/fa';


import { useThemeContext } from '../ThemeContext';

export default function Navbar({ setIsSearchOpen, isSearchOpen }) {
  const { darkMode, toggleTheme } = useThemeContext();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <nav
      className={`shadow-lg h-full w-64 p-8 relative flex flex-col justify-between ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div>
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
          {!isSearchOpen && 'Instagram'}
        </h1>

        <div className="flex flex-col items-start space-y-10">
          <Link to="/home" className="flex items-center text-2xl hover:text-blue-500">
            <FaHome className="mr-4 text-3xl" />
            {!isSearchOpen && 'Home'}
          </Link>
          {/* <Link to="/follow" className="flex items-center text-2xl hover:text-blue-500">
            <FaUserFriends className="mr-4 text-3xl" />
            {!isSearchOpen && 'Follow'}
          </Link> */}
          <Link to="/chat" className="flex items-center text-2xl hover:text-blue-500">
            <FaComments className="mr-4 text-3xl" />
            {!isSearchOpen && 'Chat'}
          </Link>
          <Link to="/create" className="flex items-center text-2xl hover:text-blue-500">
  <FaPlus className="mr-4 text-3xl" />
  {!isSearchOpen && 'Create'}
</Link>
       
          <Link to="/profile" className="flex items-center text-2xl hover:text-blue-500">
            <FaUser className="mr-4 text-3xl" />
            {!isSearchOpen && 'Profile'}
          </Link>

          {/* Toggle Search */}
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="flex items-center text-2xl hover:text-blue-500 focus:outline-none"
          >
            <FaSearch className="mr-4 text-3xl" />
            {!isSearchOpen && 'Search'}
          </button>

          {/* Dark Mode Toggle */}
          {/* <button onClick={toggleTheme} className="flex items-center text-2xl focus:outline-none">
            {darkMode ? (
              <FaSun className="text-yellow-500 text-3xl" />
            ) : (
              <FaMoon className="text-blue-500 text-3xl" />
            )}
          </button> */}
        </div>
      </div>

      {/* Footer Section with More Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className="flex items-center text-2xl hover:text-blue-500 focus:outline-none"
        >
          <FaBars className="mr-4 text-3xl" />
          {!isSearchOpen && 'More'}
        </button>

        {isMoreOpen && (
          <div className="absolute left-0 bottom-14 bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg rounded-md w-48 py-4 px-2 z-10">
            <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaCog className="mr-4 text-2xl" />
              Settings
            </Link>
            <Link to="/saved" className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaBookmark className="mr-4 text-2xl" />
              Saved
            </Link>
            <button onClick={toggleTheme} className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <FaExchangeAlt className="mr-4 text-2xl" />
              Switch Appearance
            </button>
            <Link to="/logout" className="flex items-center px-4 py-2 hover:bg-red-500 focus:outline-none">
              <FaSignOutAlt className="mr-4 text-2xl" />
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}