import React, { useState } from "react";
import { useDispatch } from "react-redux";
//import { likePost, addComment } from "./features/postSlice";
import { likePost, addComment } from "../../features/postSlice";
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Comment from "./Comment";

const Post = ({ post, darkMode }) => {
  const dispatch = useDispatch();
  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async (postId) => {
    try {
      await dispatch(likePost(postId)).unwrap();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await dispatch(addComment({ postId, commentText })).unwrap();
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className={`${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"} rounded-lg border mb-6`}>
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img
          src={post.user?.avatar || `https://i.pravatar.cc/40?img=${post.userId}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="ml-3 font-semibold">{post.user?.username || "user_" + post.userId}</span>
      </div>

      {/* Post Image */}
      <img src={post.image_url} alt="Post" className="w-full object-cover aspect-square" />

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button onClick={() => handleLike(post._id)} className="hover:opacity-50 transition-opacity">
              {post.isLiked ? <HeartSolidIcon className="w-7 h-7 text-red-500" /> : <HeartIcon className="w-7 h-7" />}
            </button>
            <button onClick={() => setOpenComments(!openComments)}>
              <ChatBubbleOvalLeftIcon className="w-7 h-7" />
            </button>
            <PaperAirplaneIcon className="w-7 h-7 rotate-45" />
          </div>
          <BookmarkIcon className="w-7 h-7" />
        </div>

        {/* Likes Count */}
        <p className="font-semibold mb-1">{post.likes_count || post.likes?.length || 0} likes</p>

        {/* Caption */}
        <p className="text-sm">
          <span className="font-semibold">{post.user?.username}</span> {post.caption}
        </p>

        {/* Comments Section */}
        {openComments && (
          <div className="mt-4">
            {/* Existing Comments */}
            {post.comments?.map((comment) => (
              <Comment key={comment._id} comment={comment} postId={post._id} darkMode={darkMode} />
            ))}

            {/* Add New Comment */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${darkMode ? "placeholder-gray-500" : "placeholder-gray-400"}`}
                  onKeyPress={(e) => e.key === "Enter" && handleComment(post._id)}
                />
                <button
                  onClick={() => handleComment(post._id)}
                  className={`text-sm font-semibold ${commentText.trim() ? "text-blue-500" : "text-blue-300"}`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;