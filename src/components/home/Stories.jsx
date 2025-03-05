import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowingStories } from '../../features/storySlice';
import { useNavigate } from 'react-router-dom';

const Stories = ({ darkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stories, loading } = useSelector((state) => state.story);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    dispatch(fetchFollowingStories());
  }, [dispatch]);

  const handleStoryClick = (story) => {
    if (story.user?._id === userId) {
      navigate('/profile');
    } else {
      navigate(`/stories/${story.user?._id}`);
    }
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading stories...</div>;

  return (
    <div className={`${darkMode ? 'bg-neutral-900' : 'bg-white'} border ${
      darkMode ? 'border-neutral-800' : 'border-gray-200'
    } rounded-lg p-4 mb-6`}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div 
            key={story._id} 
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            onClick={() => handleStoryClick(story)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
              <div className="bg-white rounded-full p-0.5">
                <img
                  src={story.user?.profile_picture || '/default-avatar.png'} // Fallback to default avatar
                  alt="Story"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {story.user?._id === userId ? 'Your story' : story.user?.name || 'Unknown User'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;