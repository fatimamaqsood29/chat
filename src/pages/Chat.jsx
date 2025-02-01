import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Chat() {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const chatUser = {
    id: 1,
    name: 'Alice',
    avatar: 'https://via.placeholder.com/150',
  };

  useEffect(() => {
    if (chatUser) {
      const timer = setTimeout(() => {
        setMessages([...messages, { id: messages.length + 1, text: `Hello from ${chatUser.name}!`, sender: 'them' }]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, chatUser]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'me' }]);
      setMessage('');
      toast.success('Message sent!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 my-2 rounded-lg max-w-xs ${
              msg.sender === 'me' ? 'bg-blue-500 text-white ml-auto' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white mr-auto'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </motion.div>
  );
}