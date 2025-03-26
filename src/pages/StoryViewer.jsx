import React, { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import axios from "axios";

const StoryViewer = ({ stories, initialIndex, onClose, isOwnProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null); // For the three-dot menu
  const openMenu = Boolean(anchorEl); // Check if the menu is open

  const currentStory = stories[currentIndex];

  // Debugging logs
  console.log("isOwnProfile:", isOwnProfile);
  console.log("Stories:", stories);
  console.log("Current Story:", currentStory);

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

  // Handle story deletion
  const handleDeleteStory = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/stories/${currentStory._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Story deleted successfully!");
      onClose(); // Close the viewer after deletion
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story.");
    }
  };

  // Handle three-dot menu open
  const handleMenuOpen = (event) => {
    console.log("Menu opened"); // Debugging
    setAnchorEl(event.currentTarget);
  };

  // Handle three-dot menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
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

        {/* Three-Dot Menu (Visible only for the story owner) */}
        {isOwnProfile && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1000, // Ensure it is above other elements
            }}
          >
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
              }}
            >
              <MoreVertIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleDeleteStory();
                  handleMenuClose();
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon sx={{ mr: 1 }} />
                Delete Story
              </MenuItem>
            </Menu>
          </Box>
        )}

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

        {/* Menu and Delete Button for Own Stories */}
        {isOwnProfile && (
          <div className="absolute top-4 right-12">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white text-2xl"
            >
              &#8942; {/* Three dots icon */}
            </button>
            {showMenu && (
              <button
                onClick={handleDeleteStory}
                className="absolute right-0 top-8 text-white text-sm bg-red-500 px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;