import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserProfile from '../components/UserProfile';

export default function Follow() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', bio: 'Loves hiking', avatar: 'https://via.placeholder.com/150', isFollowing: false },
    { id: 2, name: 'Bob', bio: 'Fan of photography', avatar: 'https://via.placeholder.com/150', isFollowing: false },
  ]);

  const toggleFollow = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4"
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Follow Users</h1>
      <div className="space-y-4 max-w-md mx-auto">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <UserProfile user={user} onFollow={toggleFollow} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}