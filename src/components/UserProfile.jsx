import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile({ user, onFollow }) {
  const navigate = useNavigate();

  const handleFollow = () => {
    onFollow(user.id);
    // Navigate to the chat screen if the user is being followed
    if (!user.isFollowing) {
      navigate(`/chat/${user.id}`);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="h-12 w-12 rounded-full" src={user.avatar} alt={user.name} />
      </div>
      <div>
        <div className="text-xl font-medium text-black">{user.name}</div>
        <p className="text-gray-500">{user.bio}</p>
        <button
          onClick={handleFollow}
          className="mt-2 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          {user.isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );
}