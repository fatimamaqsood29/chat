import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addReply, updateReply } from "../../features/postSlice";
//import { likePost, addComment } from "../../features/postSlice";

import Reply from "./Reply";

const Comment = ({ comment, postId, darkMode }) => {

  const dispatch = useDispatch();
  const [openReplies, setOpenReplies] = useState(false);
  const [openReplyInput, setOpenReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editingReply, setEditingReply] = useState(null);

  const handleReply = async () => {
    console.log(comment);

    if (!replyText.trim()) return;
    try {
      console.log("commitid",comment._id);

      await dispatch(addReply({ postId, commentId: comment.comment_id, replyText })).unwrap();
      
      setReplyText("");
      setOpenReplies(true);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleUpdateReply = async (replyId) => {
    if (!editingReply?.text.trim()) return;
    try {
      await dispatch(updateReply({ postId, commentId: comment._id, replyId, replyText: editingReply.text })).unwrap();
      setEditingReply(null);
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-start text-sm">
        <span className="font-semibold">{comment.user?.username}</span>
        <span className="ml-2 flex-1">{comment.text}</span>
      </div>

      {/* Replies Section */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-2">
          <button onClick={() => setOpenReplies(!openReplies)} className="text-xs text-blue-500 mb-1">
            {openReplies ? "Hide replies" : `View replies (${comment.replies.length})`}
          </button>
          {openReplies &&
            comment.replies.map((reply) => (
              <Reply
                key={reply._id}
                reply={reply}
                postId={postId}
                commentId={comment._id}
                darkMode={darkMode}
                editingReply={editingReply}
                setEditingReply={setEditingReply}
                handleUpdateReply={handleUpdateReply}
              />
            ))}
        </div>
      )}

      {/* Reply Input */}
      <div className="flex gap-2 mt-1">
        <button onClick={() => setOpenReplyInput(!openReplyInput)} className="text-xs text-blue-500">
          Reply
        </button>
      </div>
      {openReplyInput && (
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none ${darkMode ? "placeholder-gray-500" : "placeholder-gray-400"}`}
            onKeyPress={(e) => e.key === "Enter" && handleReply()}
          />
          <button
            onClick={handleReply}
            className={`text-sm font-semibold ${replyText.trim() ? "text-blue-500" : "text-blue-300"}`}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;