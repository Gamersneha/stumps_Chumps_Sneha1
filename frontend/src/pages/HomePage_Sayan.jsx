import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.scss";
import cbg from "/HomeBg.jpg";

// ✅ Reusable Neon Button
const NeonButton = ({ text, color, children, extraClass, onClick }) => (
  <button
    className={`neon-button ${color} ${extraClass || ""}`}
    onClick={onClick}
    style={extraClass === "fixed-size" ? { minWidth: "150px" } : {}}
  >
    {children || text}
  </button>
);

// ✅ Neon Logo Text
const NeonLogo = ({ text }) => <h1 className="neon-logo">{text}</h1>;

export default function HomeSayan() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nickname, setNickname] = useState("Player1");
  const [avatarUrl, setAvatarUrl] = useState(
    `https://api.dicebear.com/6.x/big-smile/svg?seed=${Math.random()
      .toString(36)
      .substring(7)}`
  );
  const navigate = useNavigate();

  const generateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(
      `https://api.dicebear.com/6.x/big-smile/svg?seed=${randomSeed}`
    );
  };

  return (
    <div
      className="home-container"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${cbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔮 Background Spline Scene */}
      <Spline scene="https://prod.spline.design/sBxcqdcu7T7RWfKs/scene.splinecode" />

      {/* 🌌 UI Overlay */}
      <div
        className="ui-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column", // Keep as column to separate nav from logo
          color: "white",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {/* 🔝 Top Nav - UNIFIED STRUCTURE */}
        <div
          className="top-nav"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "20px 40px",
            pointerEvents: "auto",
            boxSizing: "border-box", // Prevents padding from making it too wide
          }}
        >
          {/* ✅ Left Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* The first button in your image is cut off, assuming it's History */}
            <NeonButton text="History" onClick={() => navigate("/history")} />
            <NeonButton text="RECORDS" onClick={() => navigate("/records")} />
          </div>

          {/* ✅ Center "Play with AI" Button */}
          <div>
            <NeonButton
              text="PLAY WITH AI"
              color="pink"
              onClick={() => navigate("/toss")}
            />
          </div>

          {/* ✅ Right Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/rules">
              <NeonButton text="Rules" color="blue" />
            </Link>
            <NeonButton text="Tutorial" color="blue" />
            <div style={{ position: "relative" }}>
              <NeonButton
                color="blue"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                  }}
                />
              </NeonButton>
              {isMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50px",
                    background: "#111",
                    borderRadius: "10px",
                    padding: "15px",
                    minWidth: "220px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
                    zIndex: 1000,
                    border: "1px solid #0ff",
                    color: "#fff",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#0ff",
                      marginBottom: "10px",
                    }}
                  >
                    Profile
                  </p>
                  <div style={{ marginBottom: "10px" }}>
                    <label
                      htmlFor="nickname"
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        color: "#0ff",
                        fontWeight: "bold",
                      }}
                    >
                      Nickname
                    </label>
                    <input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter nickname"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #0ff",
                        marginBottom: "10px",
                        background: "#222",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <button
                    onClick={generateAvatar}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #0ff",
                      background: "none",
                      color: "#0ff",
                      cursor: "pointer",
                    }}
                  >
                    Generate Avatar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Main Content Area to Center the Logo */}
        <div
          style={{
            flexGrow: 1, // Takes up the remaining vertical space
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="logo-center" style={{ textAlign: "center" }}>
            <NeonLogo text="Stumps" />
            <NeonLogo text="Chumps" />
          </div>
        </div>

        {/* The bottom-nav has been removed */}
      </div>
    </div>
  );
}
