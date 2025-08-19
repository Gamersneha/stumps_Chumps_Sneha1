// History.jsx (Match History Page only)
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ import arrow icon
import "./History.css";

const History = () => {
  // get nickname (default "Player123")
  const nickname = localStorage.getItem("nickname") || "Player123";

  // Match history dummy data
  const matches = [
    { player1: nickname, player2: "Mr AI", winner: "Mr AI", margin: 18 },
    { player1: nickname, player2: "AI Mahashai", winner: nickname, margin: 12 },
    { player1: nickname, player2: "Jai Ho AI", winner: "Jai Ho AI", margin: 6 },
    { player1: nickname, player2: "Ho AI", winner: "Ho AI", margin: 12 },
    { player1: nickname, player2: "Ho AI", winner: "Ho AI", margin: 12 },
    { player1: nickname, player2: "Ho AI", winner: "Ho AI", margin: 12 },
  ];

  return (
    <div className="profile-page">
      {/* ✅ Back to Home Arrow */}
      <Link to="/" className="back-home">
        <ArrowLeft size={28} /> {/* icon */}
      </Link>

      {/* Career History */}
      <h2 className="career-title">Match History</h2>

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
