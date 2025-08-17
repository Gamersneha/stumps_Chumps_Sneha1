import React, { useState, useEffect } from "react";

const Avatar = ({ nickname }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (nickname) {
      const url = `https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(nickname)}`;
      setAvatarUrl(url);
      localStorage.setItem("avatar", url);
    }
  }, [nickname]);

  return (
    <img 
      src={avatarUrl || localStorage.getItem("avatar")} 
      alt="avatar" 
      style={{ width: 80, height: 80, borderRadius: "50%" }} 
    />
  );
};

export default Avatar;
