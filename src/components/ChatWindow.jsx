import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ChatWindow({ users }) {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const chatUser = users.find(user => user.id === parseInt(userId));

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

  if (!chatUser) {
    return <div className="p-4 text-red-500">User not found!</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 my-2 rounded-lg max-w-xs ${
              msg.sender === 'me' ? 'bg-blue-500 text-white ml-auto' : 'bg-white text-gray-800 mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}