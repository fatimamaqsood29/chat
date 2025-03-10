import React, { useEffect, useState } from 'react';

const StoryViewer = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  // Handle story progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          goToNextStory(); // Move to the next story when progress completes
          return 0;
        }
        return prev + 1;
      });
    }, 30); // Adjust the interval for smoother progress

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Navigate to the next story
  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0); // Reset progress for the next story
    } else {
      onClose(); // Close the viewer if there are no more stories
    }
  };

  // Navigate to the previous story
  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0); // Reset progress for the previous story
    }
  };

  // Handle swipe gestures
  const handleSwipe = (event) => {
    const touchStartX = event.touches[0].clientX;
    const touchEndX = (event.changedTouches || event.touches)[0].clientX;

    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      goToPreviousStory(); // Swipe right to go to the previous story
    } else if (deltaX < -50) {
      goToNextStory(); // Swipe left to go to the next story
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onTouchStart={handleSwipe}
      onTouchEnd={handleSwipe}
    >
      <div className="relative max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-700 rounded-full">
          <div
            className="h-1 bg-white rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Story Image */}
        <img
          src={currentStory.image_url}
          alt="Story"
          className="max-h-screen object-contain"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          &times;
        </button>

        {/* User Info */}
        <div className="absolute top-8 left-4 flex items-center">
          <img
            src={currentStory.user_profile_picture || "/default-avatar.png"}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-white font-semibold">
            {currentStory.user_name}
          </span>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPreviousStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
        >
          &#10094;
        </button>
        <button
          onClick={goToNextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;