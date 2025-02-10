import React from 'react';

export default function ReelCard({ reel }) {
  return (
    <div className="w-64 h-96 bg-gray-100 rounded-lg shadow-md overflow-hidden">
      <video
        src={reel.videoUrl}
        controls
        className="w-full h-full object-cover"
      />
      <div className="p-2">
        <h2 className="text-lg font-bold">{reel.title}</h2>
        <p className="text-sm text-gray-600">{reel.description}</p>
      </div>
    </div>
  );
}