import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserFriends,
  FaComments,
  FaSun,
  FaMoon,
  FaUser,
  FaHome,
  FaSearch,
  FaBars,
  FaCompass,
  FaCog,
  FaBookmark,
  FaSignOutAlt,
  FaPlus,
  FaExchangeAlt,
} from "react-icons/fa";
//import { useSelector } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { useThemeContext } from "../ThemeContext";
import { logout } from "../features/authSlice"; // Import logout action

export default function Navbar({ setIsSearchOpen, isSearchOpen }) {
  const dispatch = useDispatch();

  const { darkMode, toggleTheme } = useThemeContext();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { user } = useSelector((state) => state.auth); 
  // Access user info from Redux

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`shadow-lg h-full w-64 p-8 hidden lg:flex flex-col justify-between fixed left-0 top-0 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div>
          <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
            {!isSearchOpen && "Instagram"}
          </h1>

          <div className="flex flex-col items-start space-y-10">
            <Link
              to="/home"
              className="flex items-center text-2xl hover:text-blue-500"
            >
              <FaHome className="mr-4 text-3xl" />
              {!isSearchOpen && "Home"}
            </Link>

            <Link
              to="/chat"
              className="flex items-center text-2xl hover:text-blue-500"
            >
              <FaComments className="mr-4 text-3xl" />
              {!isSearchOpen && "Chat"}
            </Link>

            <Link
              to="/create"
              className="flex items-center text-2xl hover:text-blue-500"
            >
              <FaPlus className="mr-4 text-3xl" />
              {!isSearchOpen && "Create"}
            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className="flex items-center text-2xl hover:text-blue-500"
            >
              <FaUser className="mr-4 text-3xl" />
              {!isSearchOpen && "Profile"}
            </Link>

            {/* Toggle Search */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="flex items-center text-2xl hover:text-blue-500 focus:outline-none"
            >
              <FaSearch className="mr-4 text-3xl" />
              {!isSearchOpen && "Search"}
            </button>

            <Link
              to="/explorer"
              className="flex items-center text-2xl hover:text-blue-500"
            >
              <FaCompass className="mr-4 text-3xl" />
              Explorer
            </Link>
          </div>
        </div>

        {/* Footer Section with More Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className="flex items-center text-2xl hover:text-blue-500 focus:outline-none"
          >
            <FaBars className="mr-4 text-3xl" />
            {!isSearchOpen && "More"}
          </button>

          {isMoreOpen && (
            <div className="absolute left-0 bottom-14 bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg rounded-md w-48 py-4 px-2 z-10">
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaCog className="mr-4 text-2xl" />
                Settings
              </Link>
              <Link
                to="/saved"
                className="flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaBookmark className="mr-4 text-2xl" />
                Saved
              </Link>
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              >
                <FaExchangeAlt className="mr-4 text-2xl" />
                Switch Appearance
              </button>
              
              <Link
                to="/login"
                className="flex items-center px-4 py-2 hover:bg-red-500 focus:outline-none"
                onClick={() => dispatch(logout())} // Dispatch logout action
              >
                <FaSignOutAlt className="mr-4 text-2xl" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 w-full shadow-md flex justify-between p-4 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <Link to="/home" className="flex flex-col items-center">
          <FaHome className="text-2xl" />
          <span className="text-sm">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center">
          <FaSearch className="text-2xl" />
          <span className="text-sm">Search</span>
        </Link>
        <Link to="/create" className="flex flex-col items-center">
          <FaPlus className="text-2xl" />
          <span className="text-sm">Create</span>
        </Link>
        <Link to="/explorer" className="flex flex-col items-center">
          <FaCompass className="text-2xl" />
          <span className="text-sm">Explorer</span>
        </Link>
        
        <Link
          to={`/profile/${user?.id}`}
          className="flex items-center text-2xl hover:text-blue-500"
        >
          <FaUser className="mr-4 text-3xl" />
          {!isSearchOpen && "Profile"}
        </Link>
      </nav>
    </>
  );
}
