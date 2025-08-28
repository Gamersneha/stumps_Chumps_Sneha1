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
    if (l === 0) return w > 0 ? "∞" : "0.00";
    return (w / l).toFixed(2);
  }

  function computeStats(matches) {
    const total = matches.length;

    const defaultStats = {
      total: 0,
      draws: 0,
      last: "—",
      human: { wins: 0, losses: 0, winpct: 0, ratio: "0.00", streak: 0 },
      battingStats: [
        {
          MAT: 0,
          RUNS: 0,
          HS: 0,
          AVG: "0.00",
          SR: "0.00",
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
          AVE: "0.00",
          ECON: "0.00",
          SR: "0.00",
        },
      ],
    };

    if (total === 0) {
      return defaultStats;
    }

    let humanW = 0,
      humanL = 0,
      draws = 0;
    matches.forEach((m) => {
      if (m.winner === "Human") humanW++;
      else if (m.winner === "AI") humanL++;
      else draws++;
    });

    let humanStreak = 0;
    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i].winner === "Human") humanStreak++;
      else break;
    }

    const career = {
      RUNS: 0,
      HS: 0,
      HUNDREDS: 0,
      FIFTIES: 0,
      BALLS_FACED: 0,
      DISMISSALS: 0,
      RUNS_CONCEDED: 0,
      BALLS_BOWLED: 0,
      WIKTS_TAKEN: 0,
      BEST_RUNS: Infinity,
      BEST_WICKETS: 0,
    };

    matches.forEach((m) => {
      // --- ROBUST AGGREGATION ---
      // Use `|| 0` to safely handle old records that might be missing data.
      const humanScore = m.humanScore || 0;
      const aiScore = m.aiScore || 0;
      const humanWickets = m.humanWickets || 0;
      const aiWickets = m.aiWickets || 0;

      career.RUNS += humanScore;
      career.HS = Math.max(career.HS, humanScore);
      if (humanScore >= 100) career.HUNDREDS++;
      else if (humanScore >= 50) career.FIFTIES++;
      career.BALLS_FACED += m.humanBalls || 0;
      career.DISMISSALS += aiWickets;

      career.RUNS_CONCEDED += aiScore;
      career.BALLS_BOWLED += m.aiBalls || 0;
      career.WIKTS_TAKEN += humanWickets;

      // Best Bowling calculation
      if (humanWickets > career.BEST_WICKETS) {
        career.BEST_WICKETS = humanWickets;
        career.BEST_RUNS = aiScore;
      } else if (
        humanWickets === career.BEST_WICKETS &&
        aiScore < career.BEST_RUNS
      ) {
        career.BEST_RUNS = aiScore;
      }
    });

    const battingAvg =
      career.DISMISSALS > 0
        ? (career.RUNS / career.DISMISSALS).toFixed(2)
        : "N/A";
    const battingSr =
      career.BALLS_FACED > 0
        ? ((career.RUNS / career.BALLS_FACED) * 100).toFixed(2)
        : "0.00";

    const bowlingEcon =
      career.BALLS_BOWLED > 0
        ? ((career.RUNS_CONCEDED / career.BALLS_BOWLED) * 6).toFixed(2)
        : "0.00";
    const bowlingAve =
      career.WIKTS_TAKEN > 0
        ? (career.RUNS_CONCEDED / career.WIKTS_TAKEN).toFixed(2)
        : "N/A";
    const bowlingSr =
      career.WIKTS_TAKEN > 0
        ? (career.BALLS_BOWLED / career.WIKTS_TAKEN).toFixed(2)
        : "N/A";
    const bowlingBbm =
      career.BEST_WICKETS > 0
        ? `${career.BEST_WICKETS}/${career.BEST_RUNS}`
        : "N/A";

    return {
      total,
      draws,
      last: matches.length > 0 ? matches[total - 1].winner : "—",
      human: {
        wins: humanW,
        losses: humanL,
        winpct: total > draws ? humanW / (total - draws) : 0,
        ratio: ratio(humanW, humanL),
        streak: humanStreak,
      },
      battingStats: [
        {
          MAT: total,
          RUNS: career.RUNS,
          HS: career.HS,
          AVG: career.RUNS / total,
          SR: battingSr,
          HUNDREDS: career.HUNDREDS,
          FIFTIES: career.FIFTIES,
          SIXES: 0,
        },
      ],
      bowlingStats: [
        {
          MAT: total,
          BALLS: career.BALLS_BOWLED,
          RUNS: career.RUNS_CONCEDED,
          WIKTS: career.WIKTS_TAKEN,
          BBM: bowlingBbm,
          AVE: bowlingAve,
          ECON: bowlingEcon,
          SR: bowlingSr,
        },
      ],
    };
  }

  const stats = computeStats(matches);

  // Radar data and options remain unchanged...
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
          parseFloat(stats.human.ratio) || 0,
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
      legend: { position: "top", labels: { color: "#e6e8ee" } },
      title: { display: true, text: "Human Stats Overview", color: "#e6e8ee" },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { color: "#e6e8ee", backdropColor: "rgba(0,0,0,0.5)" },
        grid: { color: "rgba(255,255,255,0.1)" },
        angleLines: { color: "rgba(255,255,255,0.2)" },
        pointLabels: { color: "#e6e8ee" },
        suggestedMax:
          Math.max(stats.human.wins, stats.human.losses, stats.draws, 5) + 2,
      },
    },
  };

  return (
    // JSX remains unchanged...
    <div className="records-wrapper">
  <header
  style={{
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 0",
  }}
>
  {/* Back Arrow in the top-left */}
  {/* <span
    onClick={() => (window.location.href = "/")}
    style={{
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "4rem",
      fontWeight: "bold",
      color: "#e6e8ee",
    }}
  >
    ←
  </span> */}

  {/* Centered Heading */}
  <h1 style={{ margin: 0, textAlign: "center" }}>
    Hand Cricket — Match Records
  </h1>
</header>


      <main className="flex-1 container">
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
              <div className="label">Win Streak</div>
              <div className="value">{stats.human.streak / 2}</div>
            </div>
          </div>
        </div>

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
                      <td>{b.HUNDREDS}</td>
                      <td>{b.FIFTIES}</td>
                      <td>{b.SIXES}</td>
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
                      <td>{b.WIKTS / 2}</td>
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
