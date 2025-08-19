import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Link } from "react-router-dom";
import "../styles/home.scss";
import cbg from "/HomeBg.jpg";
import NicknamePopup from "./NicknamePopup";

// DiceBear base URL
const avatarBase = "https://api.dicebear.com/6.x/adventurer/svg?seed=";

// Button Component
const NeonButton = ({ text, color, children, extraClass, onClick }) => (
  <button
    className={`neon-button ${color} ${extraClass || ""}`}
    onClick={onClick}
  >
    {children || text}
  </button>
);

// Logo Component
const NeonLogo = ({ text }) => <h1>{text}</h1>;

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "Player123"
  );
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  // Generate avatar from nickname initially if none exists
  useEffect(() => {
    if (!avatar) {
      const url = `${avatarBase}${encodeURIComponent(nickname)}`;
      setAvatar(url);
      localStorage.setItem("avatar", url);
    }
  }, [nickname]);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleSaveNickname = (newNickname) => {
    setNickname(newNickname);
    localStorage.setItem("nickname", newNickname);

    // Update avatar to match new nickname (consistent)
    const url = `${avatarBase}${encodeURIComponent(newNickname)}`;
    setAvatar(url);
    localStorage.setItem("avatar", url);
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${cbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 3D Stars Background */}
      <Canvas camera={{ position: [0, 0, 10], fov: 70 }}>
        <ambientLight intensity={0.6} />
        <Stars radius={100} depth={50} count={2000} factor={4} fade />
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="ui-overlay">
        {/* Profile (Clickable Avatar -> History Page) */}
        <div className="profile">
          <Link to="/history">
            <img
              src={avatar}
              alt="avatar"
              className="avatar"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          </Link>
          <span className="name">{nickname}</span>
        </div>

        {/* Top Nav */}
        <div className="top-nav">
          <Link to="/rules">
            <NeonButton text="Rules" color="blue" />
          </Link>
          <NeonButton text="Tutorial" color="blue" />
        </div>

        {/* Center Logo */}
        <div className="logo-center">
          <NeonLogo text="Stumps" />
          <NeonLogo text="Chumps" />
        </div>

        {/* Main Menu */}
        <div className="menu">
          <Link to="/toss">
            <NeonButton text="Play with AI" color="pink" extraClass="big-btn" />
          </Link>
        </div>

        {/* Nickname Popup */}
        <NicknamePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveNickname}
        />
      </div>
    </div>
  );
};

export default Home;
