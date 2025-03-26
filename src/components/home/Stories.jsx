import React, { useState } from "react";
import StoryViewer from "../../pages/StoryViewer";

const Stories = ({ darkMode, stories, loading, loggedInUserId, onDeleteStory }) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Get the logged-in user's ID
  const loggedInUserId = localStorage.getItem("user_id") || JSON.parse(localStorage.getItem("user"))?.id;

  const handleStoryClick = (index) => {
    setSelectedStoryIndex(index);
    //console.log(selectedStoryIndex);
    
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    
    setIsViewerOpen(false);
    setSelectedStoryIndex(null);
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading stories...</div>;

  if (stories.length === 0) {
    return <p className="text-gray-500 text-sm">No stories available</p>;
  }

  return (
    <div
      className={`${darkMode ? "bg-neutral-900" : "bg-white"} border ${
        darkMode ? "border-neutral-800" : "border-gray-200"
      } rounded-lg p-4 mb-6`}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.map((story, index) => (
          <div
            key={story._id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
              <div className="bg-white rounded-full p-0.5">
                <img
                  src={story.image_url || "/default-avatar.png"}
                  alt="Story"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className={`text-xs mt-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {story.user_name}
              
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {isViewerOpen && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
          isOwnProfile={stories[selectedStoryIndex]?.user_id === loggedInUserId} // Pass isOwnProfile
          onDeleteStory={onDeleteStory} // Pass onDeleteStory function
        />
      )}
    </div>
  );
};

export default Stories;