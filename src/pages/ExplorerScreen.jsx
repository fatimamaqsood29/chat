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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Trending Images</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
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
            <p className="text-gray-600 mt-2">❤️ {image.likes.length} | 💬 {image.comments?.length || 0}</p>

            {/* Comments Section */}
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

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
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
    </div>
  );
}
