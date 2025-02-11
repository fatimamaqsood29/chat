import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingImages } from '../store/imageSlice';

export default function TrendingImages() {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.images);

  useEffect(() => {
    dispatch(fetchTrendingImages());
  }, [dispatch]);

  return (
    <div>
      <h1>Trending Images</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        {images.map((image) => (
          <div key={image.id}>
            <h2>{image.title}</h2>
            <img src={image.url} alt={image.title} width="300" />
            <p>Likes: {image.likes} | Comments: {image.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
