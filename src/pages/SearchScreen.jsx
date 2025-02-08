import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';

export default function SearchScreen() {
  return (
    <div className="w-80 h-screen p-6 bg-white border-r shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Search</h2>
      <input
        type="text"
        placeholder="Search users"
        className="w-full p-3 border rounded-md focus:outline-none"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Recent</h3>
        <ul>
          <li className="p-2 border-b">duaazahra_ (Dua Zahra)</li>
          <li className="p-2 border-b">kkyz_0 (Kaynat Khan)</li>
          <li className="p-2 border-b">eshaminhas155 (Esha Minhas)</li>
        </ul>
      </div>
    </div>
  );
}