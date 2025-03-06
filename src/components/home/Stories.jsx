import React from "react";
import { useNavigate } from "react-router-dom";

const Stories = ({ darkMode, stories, loading }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  console.log("Logged-in User ID:", userId); // Debugging
  console.log("Stories Data:", stories); // Debugging

  const handleStoryClick = (story) => {
    const storyUserId = story?.user?._id; // Define inside function scope

    console.log("Clicked Story User ID:", storyUserId); // Debugging

    if (!userId) {
      console.warn("User ID is missing, redirecting to login.");
      navigate("/login");
      return;
    }

    if (storyUserId === userId) {
      console.log("Navigating to profile");
      navigate("/profile", { replace: true });
    } else {
      console.log(`Navigating to /stories/${storyUserId}`);
      navigate(`/stories/${storyUserId}`);
    }
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading stories...</div>;

  return (
    <div
      className={`${darkMode ? "bg-neutral-900" : "bg-white"} border ${
        darkMode ? "border-neutral-800" : "border-gray-200"
      } rounded-lg p-4 mb-6`}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.length > 0 ? (
          stories.map((story) => {
            const storyUserId = story?.user?._id; // Define inside the map function

            return (
              <div
                key={story._id}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                  <div className="bg-white rounded-full p-0.5">
                    <img
                      src={story?.user?.profile_picture || "/default-avatar.png"}
                      alt="Story"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className={`text-xs mt-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  {storyUserId === userId ? "Your story" : story?.user?.name || "Unknown User"}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No stories available</p>
        )}
      </div>
    </div>
  );
};

export default Stories;