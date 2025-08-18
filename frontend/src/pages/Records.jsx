import React, { useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./Records.scss";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

const STORAGE_KEY = "handCricketMatchLog_v2";

const Records = () => {
  const [matches] = useState(load());

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function fmtPct(n) {
    return (isFinite(n) ? (n * 100).toFixed(1) : "0.0") + "%";
  }

  function ratio(w, l) {
    if (l === 0) return w > 0 ? "∞" : 0;
    return (w / l).toFixed(2);
  }

  function computeStats(matches) {
    const total = matches.length;

    // Default state for when there are no matches played
    const defaultStats = {
      total: 0,
      draws: 0,
      last: "—",
      human: {
        played: 0,
        wins: 0,
        losses: 0,
        winpct: 0,
        ratio: 0,
        streak: 0,
      },
      battingStats: [
        {
          MAT: 0,
          RUNS: 0,
          HS: 0,
          AVG: 0,
          SR: 0,
          HUNDREDS: 0,
          FIFTIES: 0,
          SIXES: 0,
        },
      ],
      bowlingStats: [
        {
          MAT: 0,
          BALLS: 0,
          RUNS: 0,
          WIKTS: 0,
          BBM: "N/A",
          AVE: 0,
          ECON: 0,
          SR: 0,
        },
      ],
    };

    if (total === 0) {
      return defaultStats;
    }

    // --- Overview Stats ---
    let humanW = 0,
      humanL = 0,
      draws = 0;
    matches.forEach((m) => {
      if (m.winner === "Human") humanW++;
      else if (m.winner === "AI") humanL++;
      else draws++;
    });
    const last = matches[total - 1].winner;
    let humanStreak = 0;
    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i].winner === "Human") humanStreak++;
      else break;
    }

    // --- Aggregate Career Stats ---
    const careerBatting = {
      MAT: total,
      RUNS: 0,
      HS: 0,
      HUNDREDS: 0,
      FIFTIES: 0,
      SIXES: 0,
      BALLS_FACED: 0,
    };
    const careerBowling = {
      MAT: total,
      BALLS: 0,
      RUNS: 0,
      WIKTS: 0,
      BEST_RUNS: Infinity,
    };

    matches.forEach((m) => {
      // Batting aggregation (Human's performance)
      careerBatting.RUNS += m.humanScore;
      careerBatting.HS = Math.max(careerBatting.HS, m.humanScore);
      if (m.humanScore >= 100) careerBatting.HUNDREDS++;
      else if (m.humanScore >= 50) careerBatting.FIFTIES++;
      careerBatting.BALLS_FACED += m.humanBalls;
      // Note: Sixes are not tracked in the Game component, so they will remain 0.

      // Bowling aggregation (Human's performance)
      careerBowling.RUNS += m.aiScore;
      careerBowling.BALLS += m.aiBalls;
      if (m.winner === "Human") {
        // A win means the human took the AI's wicket
        careerBowling.WIKTS++;
        careerBowling.BEST_RUNS = Math.min(careerBowling.BEST_RUNS, m.aiScore);
      }
    });

    // --- Calculate Derived Stats ---
    const battingAvg =
      humanL > 0 // <-- CORRECTED: Check if the player has been dismissed at least once
        ? (careerBatting.RUNS / humanL).toFixed(2)
        : "0.00"; // Avg is runs per dismissal
    const battingSr =
      careerBatting.BALLS_FACED > 0
        ? ((careerBatting.RUNS / careerBatting.BALLS_FACED) * 100).toFixed(2)
        : "0.00";

    const bowlingAve =
      careerBowling.WIKTS > 0
        ? (careerBowling.RUNS / careerBowling.WIKTS).toFixed(2)
        : "0.00";
    const bowlingSr =
      careerBowling.WIKTS > 0
        ? (careerBowling.BALLS / careerBowling.WIKTS).toFixed(2)
        : "0.00";
    const bowlingEcon =
      careerBowling.BALLS > 0
        ? ((careerBowling.RUNS / careerBowling.BALLS) * 6).toFixed(2)
        : "0.00";
    const bowlingBbm = isFinite(careerBowling.BEST_RUNS)
      ? `1/${careerBowling.BEST_RUNS}`
      : "N/A";

    return {
      total,
      draws,
      last,
      human: {
        played: total,
        wins: humanW,
        losses: humanL,
        winpct: total ? humanW / (total - draws) : 0, // Win pct usually excludes draws
        ratio: ratio(humanW, humanL),
        streak: humanStreak,
      },
      battingStats: [
        {
          MAT: careerBatting.MAT,
          RUNS: careerBatting.RUNS,
          HS: careerBatting.HS,
          AVG: battingAvg,
          SR: battingSr,
          HUNDREDS: careerBatting.HUNDREDS,
          FIFTIES: careerBatting.FIFTIES,
          SIXES: careerBatting.SIXES,
        },
      ],
      bowlingStats: [
        {
          MAT: careerBowling.MAT,
          BALLS: careerBowling.BALLS,
          RUNS: careerBowling.RUNS,
          WIKTS: careerBowling.WIKTS,
          BBM: bowlingBbm,
          AVE: bowlingAve,
          ECON: bowlingEcon,
          SR: bowlingSr,
        },
      ],
    };
  }

  const stats = computeStats(matches);

  const radarData = {
    labels: ["Wins", "Losses", "Draws", "Win %", "W/L Ratio"],
    datasets: [
      {
        label: "Human Stats",
        data: [
          stats.human.wins,
          stats.human.losses,
          stats.draws,
          stats.human.winpct * 100,
          parseFloat(stats.human.ratio) || 0, // Ensure ratio is a number
        ],
        backgroundColor: "rgba(33,192,122,0.2)",
        borderColor: "rgba(33,192,122,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(33,192,122,1)",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // Hide the legend (e.g., "Human Stats")
      legend: {
        display: false,
      },
      // Hide the main title (e.g., "Human Stats Overview")
      title: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        // Hide the scale numbers (10, 20, 30, etc.)
        ticks: {
          display: false,
          backdropColor: "rgba(0,0,0,0)", // Also hide the tick background
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        angleLines: {
          color: "rgba(255,255,255,0.2)",
        },
        pointLabels: {
          color: "#e6e8ee",
        },
        suggestedMax:
          Math.max(stats.human.wins, stats.human.losses, stats.draws) + 5,
      },
    },
  };

  return (
    <div className="records-wrapper">
      <header>
        <h1>Stumps Chumps — Match Records</h1>
      </header>

      <main className="flex-1 container">
        {/* Overview with merged stats */}
        <div className="card">
          <h2>Overview</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="label">Total Matches</div>
              <div className="value">{stats.total / 2}</div>
            </div>
            <div className="kpi good">
              <div className="label">Wins</div>
              <div className="value">{stats.human.wins / 2}</div>
            </div>
            <div className="kpi bad">
              <div className="label">Losses</div>
              <div className="value">{stats.human.losses / 2}</div>
            </div>
            <div className="kpi warn">
              <div className="label">Draws</div>
              <div className="value">{stats.draws / 2}</div>
            </div>
            <div className="kpi">
              <div className="label">Win %</div>
              <div className="value">{fmtPct(stats.human.winpct)}</div>
            </div>
            <div className="kpi">
              <div className="label">W/L Ratio</div>
              <div className="value">{stats.human.ratio}</div>
            </div>
            <div className="kpi">
              <div className="label">Last Result</div>
              <div className="value">{stats.last}</div>
            </div>
            <div className="kpi">
              <div className="label">Human Win Streak</div>
              <div className="value">{stats.human.streak / 2}</div>
            </div>
          </div>
        </div>

        {/* Radar + Scorecard */}
        <div className="card chart-scorecard-row flex-1">
          <div className="radar-chart">
            <Radar data={radarData} options={radarOptions} />
          </div>
          <div className="scorecard">
            <h3>Batting Stats</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>MAT</th>
                    <th>RUNS</th>
                    <th>HS</th>
                    <th>AVG</th>
                    <th>SR</th>
                    <th>100</th>
                    <th>50</th>
                    <th>6S</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.battingStats.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.MAT / 2}</td>
                      <td>{b.RUNS / 2}</td>
                      <td>{b.HS}</td>
                      <td>{b.AVG}</td>
                      <td>{b.SR}</td>
                      <td>{b.HUNDREDS / 2}</td>
                      <td>{b.FIFTIES / 2}</td>
                      <td>{b.SIXES / 2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Bowling Stats</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>MAT</th>
                    <th>BALLS</th>
                    <th>RUNS</th>
                    <th>WIKTS</th>
                    <th>BBM</th>
                    <th>AVE</th>
                    <th>ECON</th>
                    <th>SR</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.bowlingStats.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.MAT / 2}</td>
                      <td>{b.BALLS / 2}</td>
                      <td>{b.RUNS / 2}</td>
                      <td>{b.WIKTS}</td>
                      <td>{b.BBM}</td>
                      <td>{b.AVE}</td>
                      <td>{b.ECON}</td>
                      <td>{b.SR}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Records;
