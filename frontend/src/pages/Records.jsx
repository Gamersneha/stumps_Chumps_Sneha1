import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import './Records.scss';
import cbg from "../../utils/HomeBg.jpg";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

const STORAGE_KEY = 'handCricketMatchLog_v2';

const Records = () => {
  const [matches] = useState(load());

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function fmtPct(n) {
    return (isFinite(n) ? (n * 100).toFixed(1) : '0.0') + '%';
  }

  function ratio(w, l) {
    if (l === 0) return w > 0 ? 100 : 0;
    return Math.min((w / l) * 100, 100);
  }

  function computeStats(matches) {
    const total = matches.length;
    let humanW = 0, humanL = 0, draws = 0, last = '—', humanStreak = 0;

    if (total > 0) last = matches[total - 1].winner;

    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i].winner === 'Human') humanStreak++;
      else break;
    }

    for (const m of matches) {
      if (m.winner === 'Human') humanW++;
      else if (m.winner === 'AI') humanL++;
      else draws++;
    }

    // Example: dynamic batting and bowling stats
    // You can replace these with actual dynamic data from matches
    const battingStats = matches.map(m => ({
      MAT: m.played ?? 0,
      RUNS: m.runs ?? 0,
      HS: m.highest ?? 0,
      AVG: m.avg ?? 0,
      SR: m.sr ?? 0,
      HUNDREDS: m.hundreds ?? 0,
      FIFTIES: m.fifties ?? 0,
      SIXES: m.sixes ?? 0,
    }));

    const bowlingStats = matches.map(m => ({
      MAT: m.played ?? 0,
      BALLS: m.balls ?? 0,
      RUNS: m.runsB ?? 0,
      WIKTS: m.wickets ?? 0,
      BBM: m.bbm ?? 0,
      AVE: m.ave ?? 0,
      ECON: m.econ ?? 0,
      SR: m.srB ?? 0,
    }));

    return {
      total,
      draws,
      last,
      human: {
        played: total,
        wins: humanW,
        losses: humanL,
        winpct: total ? humanW / total : 0,
        ratio: ratio(humanW, humanL),
        streak: humanStreak,
      },
      battingStats: battingStats.length ? battingStats : [{
        MAT: 0, RUNS: 0, HS: 0, AVG: 0, SR: 0, HUNDREDS: 0, FIFTIES: 0, SIXES: 0
      }],
      bowlingStats: bowlingStats.length ? bowlingStats : [{
        MAT: 0, BALLS: 0, RUNS: 0, WIKTS: 0, BBM: 0, AVE: 0, ECON: 0, SR: 0
      }],
    };
  }

  const stats = computeStats(matches);

  const radarData = {
    labels: ['Wins', 'Losses', 'Draws', 'Win %', 'W/L Ratio'],
    datasets: [
      {
        label: 'Human Stats',
        data: [
          stats.human.wins,
          stats.human.losses,
          stats.draws,
          stats.human.winpct * 100,
          stats.human.ratio,
        ],
        backgroundColor: 'rgba(33,192,122,0.2)',
        borderColor: 'rgba(33,192,122,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(33,192,122,1)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e6e8ee' } },
      title: { display: true, text: 'Human Stats Overview', color: '#e6e8ee' },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { color: '#e6e8ee' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        angleLines: { color: 'rgba(255,255,255,0.2)' },
        suggestedMax: Math.max(
          stats.human.wins,
          stats.human.losses,
          stats.draws,
          stats.human.winpct * 100,
          stats.human.ratio
        ) + 5,
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
              <div className="value">{stats.total}</div>
            </div>
            <div className="kpi good">
              <div className="label">Wins</div>
              <div className="value">{stats.human.wins}</div>
            </div>
            <div className="kpi bad">
              <div className="label">Losses</div>
              <div className="value">{stats.human.losses}</div>
            </div>
            <div className="kpi warn">
              <div className="label">Draws</div>
              <div className="value">{stats.draws}</div>
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
              <div className="value">{stats.human.streak}</div>
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
                      <td>{b.MAT ?? 0}</td>
                      <td>{b.RUNS ?? 0}</td>
                      <td>{b.HS ?? 0}</td>
                      <td>{b.AVG ?? 0}</td>
                      <td>{b.SR ?? 0}</td>
                      <td>{b.HUNDREDS ?? 0}</td>
                      <td>{b.FIFTIES ?? 0}</td>
                      <td>{b.SIXES ?? 0}</td>
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
                      <td>{b.MAT ?? 0}</td>
                      <td>{b.BALLS ?? 0}</td>
                      <td>{b.RUNS ?? 0}</td>
                      <td>{b.WIKTS ?? 0}</td>
                      <td>{b.BBM ?? 0}</td>
                      <td>{b.AVE ?? 0}</td>
                      <td>{b.ECON ?? 0}</td>
                      <td>{b.SR ?? 0}</td>
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
  );
};

export default Records;
