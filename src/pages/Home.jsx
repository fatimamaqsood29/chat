import React, { useState } from "react";

const stories = [
  { id: 1, username: "mishi_262", img: "https://via.placeholder.com/50" },
  { id: 2, username: "zoha_afzal", img: "https://via.placeholder.com/50" },
  { id: 3, username: "aesthetic_girl", img: "https://via.placeholder.com/50" },
];

const initialPosts = [
  {
    id: 1,
    username: "gauravyadav_in",
    image: "https://via.placeholder.com/500",
    likes: 4300000,
    comments: [],
  },
  {
    id: 2,
    username: "makeup_by_amina06",
    image: "https://via.placeholder.com/500",
    likes: 120000,
    comments: [],
  },
];

const suggestions = [
  { id: 1, username: "random_user" },
  { id: 2, username: "cool_guy_007" },
];

const Home = () => {
  const [posts, setPosts] = useState(initialPosts);

  // Handle Like Click
  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (post.liked ? -1 : 1), liked: !post.liked }
          : post
      )
    );
  };

  // Handle Add Comment
  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, commentText] }
          : post
      )
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Instagram</h1>
        <div className="flex space-x-4">
          <button className="text-gray-700">❤️</button>
          <button className="text-gray-700">📩</button>
          <button className="text-gray-700">🔍</button>
        </div>
      </nav> */}

      {/* Main Content */}
      <div className="flex justify-center mt-4">
        <div className="w-full max-w-4xl flex gap-4">
          {/* Left Section (Stories + Feed) */}
          <div className="w-2/3">
            {/* Stories */}
            <div className="bg-white p-4 rounded-md shadow-md flex space-x-4 overflow-x-auto">
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
                <div key={post.id} className="bg-white p-4 rounded-md shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <p className="font-bold">{post.username}</p>
                  </div>
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full mt-2 rounded-md"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {/* Like Button */}
                    <button onClick={() => toggleLike(post.id)} className="text-red-500 text-lg">
                      {post.liked ? "❤️" : "🤍"}
                    </button>
                    <p className="text-sm">{post.likes} Likes</p>
                  </div>

                  {/* Comment Section */}
                  <div className="mt-2">
                    {post.comments.map((comment, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        <b>User:</b> {comment}
                      </p>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div className="mt-2 flex">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full border rounded-md p-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addComment(post.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector(`#commentInput${post.id}`);
                        addComment(post.id, input.value);
                        input.value = "";
                      }}
                      className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-md"
                    >
                      Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

           Right Section (Sidebar)
          <div className="w-1/3">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-bold mb-2">Suggestions</h2>
              <div className="flex flex-col space-y-2">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm">{user.username}</p>
                    <button className="text-blue-500 text-xs">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default Home;