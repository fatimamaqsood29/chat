import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReels } from '../store/reelsSlice';
const mockReels = [
  { id: 1, title: 'Trending Reel 1', url: 'video1.mp4' },
  { id: 2, title: 'Trending Reel 2', url: 'video2.mp4' },
];

export default function TrendingReels() {
  const dispatch = useDispatch();
  const { reels, loading, error } = useSelector((state) => state.reels);

  useEffect(() => {
    // For testing, bypass API and directly set mock data
    dispatch({ type: 'reels/fetchTrendingReels/fulfilled', payload: mockReels });
  }, [dispatch]);

  return (
    <div>
      <h1>Trending Reels</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        {reels.map((reel) => (
          <div key={reel.id}>
            <h2>{reel.title}</h2>
            <video src={reel.url} controls width="300" />
          </div>
        ))}
      </div>
    </div>
  );
}