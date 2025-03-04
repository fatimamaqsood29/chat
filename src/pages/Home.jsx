import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/postSlice";
import { fetchSuggestions } from "../features/followSlice";
import { useThemeContext } from "../ThemeContext";
import Post from "../components/home/Post";

const Home = () => {
  const { darkMode } = useThemeContext();
  const dispatch = useDispatch();
  
  const posts = useSelector((state) => state.post.posts);
  const suggestions = useSelector((state) => state.follow.suggestions);
  const postsLoading = useSelector((state) => state.post.loading);
  const suggestionsLoading = useSelector((state) => state.follow.loading);
  
  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts
    dispatch(fetchSuggestions()); // Fetch suggestions
  }, [dispatch]);

  return (
    <div className={`${darkMode ? "bg-black" : "bg-white"} min-h-screen`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-4">
          <div className="flex-1">
            {/* Stories Section */}
            <div className={`${darkMode ? "bg-neutral-900" : "bg-white"} border ${darkMode ? "border-neutral-800" : "border-gray-200"} rounded-lg p-4 mb-6`}>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                      <div className="bg-white rounded-full p-0.5">
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 1}`}
                          alt="Story"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-xs mt-1">user_{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">your_username</p>
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
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-xs text-gray-500">Suggested for you</p>
                        </div>
                      </div>
                      <button className="text-blue-500 text-xs font-semibold">Follow</button>
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