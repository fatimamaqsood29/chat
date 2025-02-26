import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/postSlice";
import { useThemeContext } from "../ThemeContext";
import Post from "../components/home/Post";

const Home = () => {
  const { darkMode } = useThemeContext();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className={`${darkMode ? "bg-black" : "bg-white"} min-h-screen`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stories */}
        <div
          className={`${
            darkMode ? "bg-neutral-900" : "bg-white"
          } border ${
            darkMode ? "border-neutral-800" : "border-gray-200"
          } rounded-lg p-4 mb-6`}
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-shrink-0"
              >
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

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post._id} post={post} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;