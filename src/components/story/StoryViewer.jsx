import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const StoryViewer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStories(response.data);
      } catch (error) {
        toast.error('Failed to load stories');
        navigate('/');
      }
    };
    fetchStories();
  }, [userId, token, navigate]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!stories.length) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <ToastContainer />
      <div className="relative max-w-2xl w-full">
        <img 
          src={stories[currentIndex].imageUrl} 
          alt="Story" 
          className="max-h-screen object-contain"
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
          <button 
            onClick={handlePrev}
            className="text-white text-2xl"
          >
            ←
          </button>
          <button 
            onClick={handleNext}
            className="text-white text-2xl"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;