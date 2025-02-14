import React from "react";
import { useThemeContext } from "../ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikePost, toggleCommentInput, addCommentToPost } from "../features/postSlice";
import { followUser, unfollowUser } from "../features/followSlice";

const stories = [
  { id: 1, username: "mishi_262", img: "https://via.placeholder.com/50" },
  { id: 2, username: "zoha_afzal", img: "https://via.placeholder.com/50" },
  { id: 3, username: "aesthetic_girl", img: "https://via.placeholder.com/50" },
];

const Home = () => {
  const { darkMode } = useThemeContext();
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post.posts);
  const followingRedux = useSelector((state) => state.follow.following);
  const suggestionsFromStore = useSelector((state) => state.follow.suggestions || []);

  // Here we use the complete suggestions list;
  // we determine whether a suggestion is already followed by checking the redux state.
  const suggestions = suggestionsFromStore;

  const handleLikeToggle = (postId) => {
    dispatch(toggleLikePost(postId));
  };

  const handleCommentToggle = (postId) => {
    dispatch(toggleCommentInput(postId));
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    dispatch(addCommentToPost({ postId, commentText }));
  };

  // Toggle follow status by dispatching the appropriate async thunk
  const handleFollowToggle = (userId, isFollowing) => {
    if (!userId) {
      console.error("Invalid userId:", userId);
      return;
    }
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  return (
    <div className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} min-h-screen`}>
      <div className="flex justify-center mt-4">
        <div className="w-full max-w-4xl flex gap-4">
          {/* Left Section: Stories & Feed */}
          <div className="w-2/3">
            {/* Stories */}
            <div className={`p-4 rounded-md shadow-md flex space-x-4 overflow-x-auto ${darkMode ? "bg-black" : "bg-white"}`}>
              {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center">
                  <img
                    src={story.img}
                    alt={story.username}
                    className="w-12 h-12 rounded-full border-2 border-red-500"
                  />
                  <p className="text-xs">{story.username}</p>
                </div>
              ))}
            </div>

            {/* Feed */}
            <div className="mt-4 space-y-4">
              {posts.map((post) => (
                <div key={post.id} className={`p-4 rounded-md shadow-md ${darkMode ? "bg-black" : "bg-white"}`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <p className="font-bold">{post.username}</p>
                  </div>
                  <img src={post.image} alt="Post" className="w-full mt-2 rounded-md" />

                  <div className="flex items-center mt-2">
                    {/* Like Section */}
                    <div className="flex flex-col items-center mr-2">
                      <button onClick={() => handleLikeToggle(post.id)} className="text-red-500 text-lg">
                        {post.liked ? "❤️" : "🤍"}
                      </button>
                      <p className="text-sm mt-1">{post.likes} Likes</p>
                    </div>

                    {/* Comment Section */}
                    <div className="flex flex-col items-center">
                      <button onClick={() => handleCommentToggle(post.id)} className="text-blue-500 text-lg">
                        💬
                      </button>
                      <p className="text-sm mt-1">{post.comments.length} Comments</p>
                    </div>
                  </div>

                  {/* Display Comments */}
                  <div className="mt-2">
                    {post.comments.map((comment, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        <b>User:</b> {comment}
                      </p>
                    ))}
                  </div>

                  {/* Comment Input */}
                  {post.showCommentInput && (
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className={`w-full border rounded-md p-2 text-sm ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(post.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Post</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Follow Suggestions */}
          <div className="w-1/3">
            <div className={`p-4 rounded-md shadow-md ${darkMode ? "bg-black" : "bg-white"}`}>
              <h2 className="text-lg font-bold mb-2">Suggestions</h2>
              <div className="space-y-4">
                {suggestions.map((user) => {
                  const isFollowing = followingRedux.some(u => u.id === user.id);
                  return (
                    <div key={user.id} className={`flex items-center justify-between p-2 rounded-md ${darkMode ? "bg-black" : "bg-white"}`}>
                      <div className="flex items-center space-x-4">
                        <img src={user.img || "https://via.placeholder.com/50"} alt={user.username} className="w-10 h-10 rounded-full" />
                        <p className="text-sm">{user.username}</p>
                      </div>
                      <button
                        onClick={() => handleFollowToggle(user.id, isFollowing)}
                        className={`px-4 py-1 rounded-md text-xs ${isFollowing ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
                {suggestions.length === 0 && <p className="text-sm">No suggestions available</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;