import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingImages } from '../store/imageSlice';
import '../App.css';

export default function TrendingImages() {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const throttleTimeout = useRef(null);

  // Initial fetch on component mount
  useEffect(() => {
    dispatch(fetchTrendingImages());
  }, [dispatch]);

  // Infinite loop scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!images.length || throttleTimeout.current) return;

      throttleTimeout.current = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (isNearBottom) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }
        throttleTimeout.current = null;
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [images.length]);

  // Calculate displayed images for infinite loop
  const displayedImages = images.length > 0
    ? [...images.slice(currentIndex), ...images.slice(0, currentIndex)]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Trending Images</h1>
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Show spinner only during initial load */}
      {loading && images.length === 0 && (
        <div className="flex justify-center my-24">
          <div className="instagram-spinner"></div>
        </div>
      )}

      {/* Show content after initial load */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedImages.map((image) => (
            <div key={image._id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{image.caption}</h2>
              {image.image_url ? (
                <img
                  src={image.image_url}
                  alt={image.caption}
                  className="w-full h-64 object-cover rounded-md"
                />
              ) : (
                <p className="text-center">Image URL not available</p>
              )}
              <p className="text-gray-600 mt-2">
                ❤️ {image.likes.length} | 💬 {image.comments?.length || 0}
              </p>

              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Comments</h3>
                <ul className="space-y-3">
                  {image.comments?.map((comment) => (
                    <li key={comment.comment_id} className="p-2 bg-gray-100 rounded-md">
                      <p className="text-sm font-semibold">{comment.user_id}</p>
                      <p className="text-sm">{comment.text}</p>
                      <small className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </small>
                      {comment.replies?.length > 0 && (
                        <ul className="ml-4 mt-2 border-l-2 border-gray-300 pl-2 space-y-2">
                          {comment.replies.map((reply) => (
                            <li key={reply.comment_id} className="text-sm bg-gray-200 p-2 rounded-md">
                              <p><strong>Reply:</strong> {reply.text}</p>
                              <small className="text-xs text-gray-500">
                                {new Date(reply.timestamp).toLocaleString()}
                              </small>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show spinner at the bottom when loading more images */}
      {loading && images.length > 0 && (
        <div className="flex justify-center my-6">
          <div className="instagram-spinner"></div>
        </div>
      )}
    </div>
  );
}