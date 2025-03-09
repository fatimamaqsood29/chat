import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotifications } from '../features/notificationSlice';
import { Toaster } from 'react-hot-toast';

const NotificationsScreen = () => {
  const dispatch = useDispatch();

  // Access the notifications state from the Redux store
  const { notifications = [], loading, error } = useSelector((state) => state.notification);

  // Fetch notifications when the component mounts
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Log notifications for debugging
  useEffect(() => {
    console.log('Redux Notifications State:', notifications);
  }, [notifications]);

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading notifications...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:ml-64">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Display notifications */}
      {notifications.length === 0 ? (
        <p>No notifications to display.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.timestamp} className="mb-4 p-4 border-b border-gray-200 dark:border-gray-700">
              {/* Notification for comments */}
              {notification.type === 'comment' && (
                <Link to={`/post/${notification.post_id}`} className="flex items-center">
                  {/* User profile picture */}
                  <img
                    src={notification.from_user.profile_picture || 'default-profile.png'}
                    alt={notification.from_user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  {/* Notification content */}
                  <div>
                    <p className="text-sm">
                      <strong className="font-semibold">{notification.from_user.name}</strong> commented:{" "}
                      <span className="text-gray-600 dark:text-gray-400">{notification.content}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Link>
              )}

              {/* Notification for follows */}
              {notification.type === 'follow' && (
                <div className="flex items-center">
                  <img
                    src={notification.from_user.profile_picture || 'default-profile.png'}
                    alt={notification.from_user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm">
                      <strong className="font-semibold">{notification.from_user.name}</strong> started following you.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsScreen;