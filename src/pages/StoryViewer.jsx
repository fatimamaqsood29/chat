import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const StoryViewer = () => {
  const { userId: urlUserId } = useParams(); // Rename to avoid conflict
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = localStorage.getItem('access_token');

  // Get userId from URL params, localStorage, or parsed user object
  const storedUserId = localStorage.getItem("user_id");
  const parsedUser = JSON.parse(localStorage.getItem("user"));
  const userId = urlUserId && urlUserId !== "undefined" ? urlUserId : storedUserId || parsedUser?.id;

  useEffect(() => {
    if (!userId || userId === "undefined") {
      toast.error("Invalid user ID. Redirecting...");
      navigate("/home");
      return;
    }

    const fetchStories = async () => {
      try {
        let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/${userId}`;
        
        // If viewing own stories, use `/stories/me`
        if (userId === storedUserId) {
          apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/me`;
        }

        console.log("Fetching stories from:", apiUrl);

        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Stories fetched:", response.data);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error.response || error);
        if (error.response?.status === 405) {
          toast.error("The server does not support this request method.");
        } else {
          toast.error("Failed to load stories.");
        }
        navigate("/home");
      }
    };

    fetchStories();
  }, [userId, token, navigate]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/home");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!stories.length) return <div>No stories available.</div>;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="relative max-w-2xl w-full">
        <img
          src={stories[currentIndex].image_url} // Fixed property name
          alt="Story"
          className="max-h-screen object-contain"
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
          <button onClick={handlePrev} className="text-white text-2xl">
            ←
          </button>
          <button onClick={handleNext} className="text-white text-2xl">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;