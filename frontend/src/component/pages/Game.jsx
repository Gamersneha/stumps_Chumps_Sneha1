import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import "../../styles/game.scss";

const Game = () => {
  const [prediction, setPrediction] = useState(null);

  // Get nickname + role from localStorage (set in Home page / NicknamePopup)
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem("nickname") || "Player123";
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "batter"; // default to batter
  });

  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("scoreboard");
    return (
      JSON.parse(saved) || {
        batter: role === "batter" ? nickname : "Mr AI",
        batterRuns: 0,
        batterBalls: 0,
        teamRuns: 0,
        wickets: 0,
        overs: 0,
        runRate: 0,
        bowler: role === "bowler" ? nickname : "Mr AI",
        bowlerWickets: 0,
      }
    );
  });

  // persist scoreboard
  useEffect(() => {
    localStorage.setItem("scoreboard", JSON.stringify(score));
  }, [score]);

  const handleDetect = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/detect");
      setPrediction(res.data);

      // Example update
      setScore((prev) => {
        const runs = prev.batterRuns + 1;
        const balls = prev.batterBalls + 1;
        const overs = Math.floor(balls / 6) + (balls % 6) / 10;
        const runRate = balls > 0 ? (prev.teamRuns + 1) / (balls / 6) : 0;

        return {
          ...prev,
          batterRuns: runs,
          batterBalls: balls,
          teamRuns: prev.teamRuns + 1,
          overs,
          runRate: runRate.toFixed(2),
        };
      });
    } catch (err) {
      console.error("Error detecting hand:", err);
    }
  };

  return (
    <div className="game-container">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="settings-btn">
          <Settings size={22} />
        </button>
      </div>

      {/* Main Game Area */}
      <div className="main-area">
        {/* Batter */}
        <div className="game-column">
          <div className="player-box">
            <div className="circle"></div>
            <span>{score.batter}</span>
          </div>
          <div className="game-box"></div>
        </div>

        {/* Bowler */}
        <div className="game-column">
          <div className="player-box">
            <span>{score.bowler}</span>
            <div className="circle"></div>
          </div>
          <div className="game-box"></div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        <span>
          🏏 {score.batter} {score.batterRuns} ({score.batterBalls})
        </span>
        <span>
          Team {score.teamRuns}-{score.wickets} ({score.overs} overs)
        </span>
        <span>Run Rate: {score.runRate}</span>
        <span>
          🎯 {score.bowler} {score.bowlerWickets}-0
        </span>
      </div>

      {/* Detect Button + Result */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleDetect}>Detect Hand</button>
        {prediction && <p>Prediction: {JSON.stringify(prediction)}</p>}
      </div>
    </div>
  );
};

export default Game;
