import React from "react";

const Reply = ({ reply, postId, commentId, darkMode, editingReply, setEditingReply, handleUpdateReply }) => {
console.log( reply, postId, commentId, darkMode, editingReply, setEditingReply, handleUpdateReply);

  const isEditing = editingReply?.id === reply._id;
console.log(isEditing);

  return (
    <div className={`flex items-start text-sm mt-1 ${darkMode ? "text-white" : "text-black"}`}>
      <span className="font-semibold">{reply.user?.username}</span>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingReply?.text || ""} // Ensure editingReply is not null
            onChange={(e) => setEditingReply({ id: reply._id, text: e.target.value })}
            className={`ml-2 flex-1 bg-transparent border-b ${
              darkMode ? "border-gray-500" : "border-gray-300"
            } focus:outline-none`}
          />
          <button
            onClick={() => handleUpdateReply(postId, commentId, reply._id, editingReply.text)}
            className="ml-2 text-blue-500 text-xs hover:underline"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <span className="ml-2 flex-1">{reply.text}</span>
          <button
            onClick={() => setEditingReply({ id: reply._id, text: reply.text })}
            className="ml-2 text-blue-500 text-xs hover:underline"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default Reply;