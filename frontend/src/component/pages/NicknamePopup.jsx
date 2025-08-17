import React, { useState } from "react";

const NicknamePopup = ({ isOpen, onClose, onSave }) => {
  const [nickname, setNickname] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (nickname.trim() !== "") {
      onSave(nickname);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Blur /}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/ Popup Card */}
      <div className="relative bg-[#0a0f1c] text-white rounded-2xl shadow-xl p-6 w-[350px]">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Nickname</h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Your nickname..."
        />
        <div className="flex justify-end mt-5 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default NicknamePopup;