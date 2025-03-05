import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/postSlice";
import { fetchSuggestions } from "../features/followSlice";
import { useThemeContext } from "../ThemeContext";
import Post from "../components/home/Post";
import Stories from "../components/home/Stories"; // Import the Stories component
import { fetchFollowingStories } from "../features/storySlice"; // Import story action

const Home = () => {
  const { darkMode } = useThemeContext();
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post.posts);
  const suggestions = useSelector((state) => state.follow.suggestions);
  const stories = useSelector((state) => state.story.stories); // Get stories from Redux store
  const postsLoading = useSelector((state) => state.post.loading);
  const suggestionsLoading = useSelector((state) => state.follow.loading);
  const storiesLoading = useSelector((state) => state.story.loading); // Get stories loading state

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts
    dispatch(fetchSuggestions()); // Fetch suggestions
    dispatch(fetchFollowingStories()); // Fetch stories
  }, [dispatch]);

  return (
    <div className={`${darkMode ? "bg-black" : "bg-white"} min-h-screen`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-4">
          <div className="flex-1">
            {/* Stories Section */}
            <Stories darkMode={darkMode} stories={stories} loading={storiesLoading} />

            {/* Posts Section */}
            {postsLoading ? (
              <p className="text-gray-500 text-sm">Loading posts...</p>
            ) : (
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Post key={post._id} post={post} darkMode={darkMode} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No posts available</p>
                )}
              </div>
            )}
          </div>

          {/* Suggestions Section */}
          <div className="w-80 hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Your avatar"
                />
                <div className="ml-4">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    your_username
                  </p>
                  <p className="text-xs text-gray-500">Your Name</p>
                </div>
              </div>
              <button className="text-blue-500 text-sm font-semibold">Switch</button>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Suggestions For You</p>
              <button className="text-xs font-bold">See All</button>
            </div>
            {suggestionsLoading ? (
              <p className="text-gray-500 text-sm">Loading suggestions...</p>
            ) : (
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((user) => (
                    <div key={user._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.profile_picture || `https://i.pravatar.cc/150?img=13`}
                          alt={user.name}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">Suggested for you</p>
                        </div>
                      </div>
                      <button className="text-blue-500 text-xs font-semibold">
                        Follow
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No suggestions available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;