import React from "react";
import { useNavigate } from "react-router-dom";

const NicknamePopup = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = React.useState("");

  if (!isOpen) return null;

  /**
   * Handles saving the nickname.
   * - Trims the nickname to ensure it's not just whitespace.
   * - Saves the nickname to the browser's localStorage.
   * - Calls the onSave prop (if provided) to pass the nickname to the parent.
   * - Closes the popup.
   */
  const handleSave = () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname !== "") {
      localStorage.setItem("nickname", trimmedNickname);
      if (onSave) {
        onSave(trimmedNickname);
      }
    }
  };

  /**
   * Handles the "Go Back" button click.
   * - Navigates the user to the previous page in their browser history.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Popup Card */}
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
            onClick={handleGoBack}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            Go Back
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
