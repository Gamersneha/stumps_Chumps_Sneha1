import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam"; // Import Webcam
import { Settings } from "lucide-react";
import "../../styles/game.scss";

const Game = () => {
  const webcamRef = useRef(null); // Create a ref for the webcam
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
    const nickname = localStorage.getItem("nickname");
    const defaultScore = {
      batter: nickname || "Player123", // Ensure batter has a default value
      batterRuns: 0,
      batterBalls: 0,
      teamRuns: 0,
      wickets: 0,
      overs: 0,
      runRate: 0,
      bowler: role === "bowler" ? nickname : "Mr AI",
      bowlerWickets: 0,
    };

    try {
      const parsedSaved = saved ? JSON.parse(saved) : {};
      return { ...defaultScore, ...parsedSaved };
    } catch {
      return defaultScore;
    }
  });

  // Persist scoreboard to localStorage
  useEffect(() => {
    localStorage.setItem("scoreboard", JSON.stringify(score));
  }, [score]);

  const handleDetect = async () => {
    if (webcamRef.current) {
      // Get the base64 image data from the webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        console.error("Failed to capture image from webcam.");
        return;
      }
      try {
        // Send the captured image to the backend
        const res = await axios.post("http://127.0.0.1:8000/detect", {
          image: imageSrc, // Your backend should expect a JSON payload with an 'image' key
        });
        setPrediction(res.data);

        // Example update - you should update this based on the actual prediction
        setScore((prev) => {
          const runs = prev.batterRuns + 1; // Example: add 1 run
          const balls = prev.batterBalls + 1;
          const overs = Math.floor(balls / 6) + (balls % 6) / 10;
          const teamRuns = prev.teamRuns + 1; // Example: add 1 run
          const runRate = balls > 0 ? teamRuns / (balls / 6) : 0;

          return {
            ...prev,
            batterRuns: runs,
            batterBalls: balls,
            teamRuns: teamRuns,
            overs,
            runRate: runRate.toFixed(2),
          };
        });
      } catch (err) {
        console.error("Error detecting hand:", err);
      }
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
            <span>{nickname}</span>
          </div>
          <div className="game-box">
            {/* Webcam Component */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              style={{ objectFit: "cover", borderRadius: "15px" }} // Style to fit the box
            />
          </div>
        </div>

        {/* Bowler */}
        <div className="game-column">
          <div className="player-box">
            <span>{score.bowler}</span>
            <div className="circle"></div>
          </div>
          <div className="game-box">
            {/* You can add bowler's camera or animation here */}
          </div>
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
