import React from 'react';
import { FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';

const NotificationsScreen = () => {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: 'john_doe',
      postPreview: 'https://via.placeholder.com/150',
      timestamp: '2h ago',
    },
    {
      id: 2,
      type: 'comment',
      user: 'jane_doe',
      comment: 'Great post!',
      postPreview: 'https://via.placeholder.com/150',
      timestamp: '5h ago',
    },
    {
      id: 3,
      type: 'follow',
      user: 'alice_smith',
      timestamp: '1d ago',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {notification.type === 'like' && (
              <FaHeart className="text-red-500 text-2xl mr-4" />
            )}
            {notification.type === 'comment' && (
              <FaComment className="text-blue-500 text-2xl mr-4" />
            )}
            {notification.type === 'follow' && (
              <FaUserPlus className="text-green-500 text-2xl mr-4" />
            )}
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notification.user}</span>{' '}
                {notification.type === 'like' && 'liked your post.'}
                {notification.type === 'comment' && `commented: "${notification.comment}"`}
                {notification.type === 'follow' && 'started following you.'}
              </p>
              <p className="text-xs text-gray-500">{notification.timestamp}</p>
            </div>
            {notification.postPreview && (
              <img
                src={notification.postPreview}
                alt="Post preview"
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsScreen;