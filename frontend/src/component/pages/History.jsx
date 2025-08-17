// History.jsx (Profile Page)
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./History.css";

const avatarBase = "https://api.dicebear.com/6.x/adventurer/svg?seed=";

const History = () => {
  const navigate = useNavigate();

  // actual saved nickname + avatar
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || "Player123"
  );
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  // temporary nickname for input field
  const [tempNickname, setTempNickname] = useState(nickname);

  useEffect(() => {
    if (!avatar) {
      const url = `${avatarBase}${encodeURIComponent(nickname)}`;
      setAvatar(url);
      localStorage.setItem("avatar", url);
    }
  }, []);

  // Match history dummy data
  const matches = [
    { player1: nickname, player2: "Mr AI", winner: "Mr AI", margin: 18 },
    { player1: nickname, player2: "AI Mahashai", winner: nickname, margin: 12 },
    { player1: nickname, player2: "Jai Ho AI", winner: "Jai Ho AI", margin: 6 },
    { player1: nickname, player2: " Ho AI", winner: " Ho AI", margin: 12 },
    { player1: nickname, player2: " Ho AI", winner: " Ho AI", margin: 12 },
    { player1: nickname, player2: " Ho AI", winner: " Ho AI", margin: 12 },
    { player1: nickname, player2: " Ho AI", winner: " Ho AI", margin: 12 },
    { player1: nickname, player2: " Ho AI", winner: " Ho AI", margin: 12 },
  ];

  const handleSave = () => {
    setNickname(tempNickname); // update actual nickname
    localStorage.setItem("nickname", tempNickname);
    localStorage.setItem("avatar", avatar);
    navigate("/"); // Go back home
  };

  const handleChangeAvatar = () => {
    const randomSeed = `${tempNickname}-${Math.floor(Math.random() * 1000)}`;
    const url = `${avatarBase}${encodeURIComponent(randomSeed)}`;
    setAvatar(url);
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Your Profile</h1>

      {/* Avatar + Nickname */}
      <div className="profile-edit">
        <img src={avatar} alt="avatar" className="profile-avatar" />
        <button className="btn" onClick={handleChangeAvatar}>
          Change Avatar
        </button>

        <input
          type="text"
          value={tempNickname}
          onChange={(e) => setTempNickname(e.target.value)}
          placeholder="Enter nickname"
          className="nickname-input"
        />

        <div className="btn-group">
          <button className="btn save" onClick={handleSave}>
            Save
          </button>
          <button className="btn cancel" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>

      {/* Career History */}
      <h2 className="career-title">Match History</h2>
      <Link to="/records">
        <button className="records-btn">Records</button>
      </Link>

      <div className="match-list">
        {matches.map((match, index) => (
          <div className="match-card" key={index}>
            <div className="player player1">{match.player1}</div>
            <div className="result">
              {match.winner} WIN <br /> BY {match.margin} RUNS
            </div>
            <div className="player player2">{match.player2}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
