import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useThemeContext } from '../ThemeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SearchScreen({ onClose }) {
  const { darkMode } = useThemeContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/search/${query}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(response.data);
      } catch (err) {
        console.error('API error:', err);
        if (err.response) {
          setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        } else {
          setError('Failed to fetch user');
        }
      }
      setLoading(false);
    };

    // Debounce the search to reduce API calls
    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, token]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className={`h-full p-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Search</h2>
        <button onClick={onClose} className="text-2xl">
          <FaTimes />
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users"
        className={`w-full p-3 border rounded-md focus:outline-none ${
          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
        }`}
      />

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : results.length > 0 ? (
          <ul>
            {results.map((user) => (
              <li
                key={user._id}
                className={`flex items-center justify-between p-2 border-b ${
                  darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
              >
                {/* Clicking on the username navigates to the user's profile page */}
                <Link to={`/profile/${user._id}`} className="flex-1">
                  <span className="font-medium">{user.name}</span>
                  {user.email && <span className="text-sm ml-2">({user.email})</span>}
                </Link>
                {/* You can add extra buttons like "Share" if needed */}
                {/* <button className="ml-2 text-blue-500">Share</button> */}
              </li>
            ))}
          </ul>
        ) : query !== '' ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Recent Searches</h3>
            {/* Implement recent searches if desired */}
            <p>No recent searches.</p>
          </div>
        )}
      </div>
    </div>
  );
}