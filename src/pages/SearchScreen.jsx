import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function SearchScreen({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const recentSearches = [
    { id: 1, username: 'duaazahra_', fullName: 'Dua Zahra' },
    { id: 2, username: 'kkyz_0', fullName: 'Kaynat Khan' },
    { id: 3, username: 'eshaminhas155', fullName: 'Esha Minhas' },
    { id: 4, username: 'bint_e_afzal30', fullName: 'Bint Afzal' },
    { id: 5, username: 'hira_mani', fullName: 'Hira Mani' },
  ];

  const handleSearch = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (text.trim() !== '') {
      const filteredResults = recentSearches.filter((user) =>
        user.username.toLowerCase().includes(text.toLowerCase()) ||
        user.fullName.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="h-full">
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
        className="w-full p-3 border rounded-md focus:outline-none"
      />

      <div className="mt-4">
        {results.length > 0 ? (
          <ul>
            {results.map((user) => (
              <li key={user.id} className="flex justify-between p-2 border-b">
                <span>
                  {user.username} ({user.fullName})
                </span>
              </li>
            ))}
          </ul>
        ) : query !== '' ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Recent</h3>
            <ul>
              {recentSearches.map((user) => (
                <li key={user.id} className="flex justify-between p-2 border-b">
                  <span>
                    {user.username} ({user.fullName})
                  </span>
                  <button className="text-red-500">✖</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}