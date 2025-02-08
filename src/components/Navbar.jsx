// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaComments,
  FaSun,
  FaMoon,
  FaUser,
  FaHome,
  FaSearch,
} from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext';

export default function Navbar({ setIsSearchOpen, isSearchOpen }) {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <nav
      className={`shadow-lg h-full w-64 p-8 ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
        {!isSearchOpen && 'Instagram'}
      </h1>

      <div className="flex flex-col items-start space-y-10">
        <Link to="/" className="flex items-center text-2xl hover:text-blue-500">
          <FaHome className="mr-4 text-3xl" />
          {!isSearchOpen && 'Home'}
        </Link>
        <Link
          to="/follow"
          className="flex items-center text-2xl hover:text-blue-500"
        >
          <FaUserFriends className="mr-4 text-3xl" />
          {!isSearchOpen && 'Follow'}
        </Link>
        <Link
          to="/chat"
          className="flex items-center text-2xl hover:text-blue-500"
        >
          <FaComments className="mr-4 text-3xl" />
          {!isSearchOpen && 'Chat'}
        </Link>
        <Link
          to="/profile"
          className="flex items-center text-2xl hover:text-blue-500"
        >
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
        <button onClick={toggleTheme} className="flex items-center text-2xl focus:outline-none">
          {darkMode ? (
            <FaSun className="text-yellow-500 text-3xl" />
          ) : (
            <FaMoon className="text-blue-500 text-3xl" />
          )}
        </button>
      </div>
    </nav>
  );
}