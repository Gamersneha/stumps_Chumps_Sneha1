import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.scss";
import cbg from "/HomeBg.jpg";
import { User } from "lucide-react";

const NeonButton = ({ text, color, children, extraClass, onClick }) => (
  <button
    className={`neon-button ${color} ${extraClass || ""}`}
    onClick={onClick}
    style={extraClass === "fixed-size" ? { minWidth: "150px" } : {}}
  >
    {children || text}
  </button>
);

const NeonLogo = ({ text }) => <h1>{text}</h1>;

const Home = () => {
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
        {/* Cricket Icon Top Left */}
        <div
          className="profile"
          style={{ position: "absolute", top: "20px", left: "20px" }}
        >
          <img
            src="Ball.png"
            alt="logo"
            style={{ width: 80, height: 80, marginLeft: "10px" }}
          />
        </div>

        {/* Top Nav */}
        <div className="top-nav">
          <Link to="/rules">
            <NeonButton text="Rules" color="blue" extraClass="fixed-size" />
          </Link>
          <NeonButton text="Tutorial" color="blue" extraClass="fixed-size" />

          {/* ✅ Profile Dropdown */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <NeonButton color="blue" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
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

                {/* Nickname Input */}
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

                {/* Avatar Display */}
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

                {/* Generate Avatar Button */}
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

        {/* Center Logo */}
        <div className="logo-center">
          <NeonLogo text="Stumps" />
          <NeonLogo text="Chumps" />
        </div>

        {/* Main Menu */}
        <div className="menu">
          <Link to="/game">
            <NeonButton
              text="Play with AI"
              color="pink"
              extraClass="big-btn"
            />
          </Link>
        </div>

        {/* Bottom Nav */}
        <div
          className="bottom-nav"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <NeonButton
            text="MATCH HISTORY"
            onClick={() => navigate("/history")}
          />
          <NeonButton text="RECORDS" onClick={() => navigate("/records")} />
        </div>
      </div>
    </div>
  );
};

export default Home;
