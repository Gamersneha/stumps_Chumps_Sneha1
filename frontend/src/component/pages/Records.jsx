import React, { useState, useEffect } from 'react';
import './Records.css';
const STORAGE_KEY = 'handCricketMatchLog_v2';

const Records = () => {
  const [matches, setMatches] = useState(load());
  const [winner, setWinner] = useState('AI');
  const [notes, setNotes] = useState('');

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function save(newMatches) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMatches));
  }

  function fmtPct(n) {
    return (isFinite(n) ? (n * 100).toFixed(1) : '0.0') + '%';
  }

  function ratio(w, l) {
    if (l === 0) return w > 0 ? '∞' : '0.00';
    return (w / l).toFixed(2);
  }

  function tsToStr(ts) {
    return new Date(ts).toLocaleString();
  }

  function computeStats(matches) {
    const total = matches.length;
    let humanW = 0, humanL = 0, draws = 0, last = '—', humanStreak = 0;
    if (total > 0) {
      last = matches[total - 1].winner;
    }
    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i].winner === 'Human') {
        humanStreak++;
      } else {
        break;
      }
    }
    for (const m of matches) {
      if (m.winner === 'Human') humanW++;
      else if (m.winner === 'AI') humanL++;
      else draws++;
    }
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
    };
  }

  const stats = computeStats(matches);

  const handleAddMatch = () => {
    const newMatches = [...matches, { ts: Date.now(), winner, notes }];
    setMatches(newMatches);
    save(newMatches);
    setNotes('');
  };

  const handleReset = () => {
    if (window.confirm('Reset all data?')) {
      setMatches([]);
      save([]);
    }
  };

  const handleSample = () => {
    const outcomes = ['AI', 'Human', 'Draw'];
    const newMatches = [
      ...matches,
      ...Array.from({ length: 10 }, (_, i) => ({
        ts: Date.now() - i * 60000,
        winner: outcomes[Math.floor(Math.random() * 3)],
        notes: '',
      })),
    ];
    setMatches(newMatches);
    save(newMatches);
  };

  return (
    <div className="bg-gradient-to-br from-[#1a2040] to-transparent min-h-screen text-text font-sans">
      <header className="p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl mb-2">Hand Cricket — Match Records</h1>
        <div className="sub text-sm text-muted">
          Record outcomes, and see matches played, wins, losses, win% and W/L ratio. Data saves to your browser.
        </div>
      </header>
      <main className="container mx-auto p-6 md:p-10 grid gap-4 max-w-6xl">
        <section className="grid grid-cols-12 gap-4">
          <div className="card col-span-12">
            <h2 className="text-lg mb-3">Overview</h2>
            <div className="kpis grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="kpi">
                <div className="label">Total Matches</div>
                <div className="value">{stats.total}</div>
              </div>
              <div className="kpi">
                <div className="label">Draws</div>
                <div className="value">{stats.draws}</div>
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

          <div className="card col-span-12">
            <h2 className="text-lg mb-3">Human Stats</h2>
            <div className="kpis grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="kpi">
                <div className="label">Matches Played</div>
                <div className="value">{stats.human.played}</div>
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
                <div className="label">Win %</div>
                <div className="value">{fmtPct(stats.human.winpct)}</div>
              </div>
              <div className="kpi">
                <div className="label">W/L Ratio</div>
                <div className="value">{stats.human.ratio}</div>
              </div>
            </div>
          </div>

          <div className="card controls col-span-12 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4">
            <div className="form grid gap-3">
              <h2 className="text-lg">Record a Match</h2>
              <div className="row flex flex-wrap gap-3 items-center" role="group" aria-label="Winner selector">
                <div className="segmented grid grid-flow-col rounded-xl overflow-hidden border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)]">
                  {['AI', 'Human', 'Draw'].map((val) => (
                    <React.Fragment key={val}>
                      <input
                        type="radio"
                        id={`win-${val.toLowerCase()}`}
                        name="winner"
                        value={val}
                        checked={winner === val}
                        onChange={(e) => setWinner(e.target.value)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`win-${val.toLowerCase()}`}
                        className="px-3.5 py-2.5 cursor-pointer font-semibold text-sm text-muted border-r last:border-r-0"
                      >
                        {val === 'AI' ? 'AI Won' : val === 'Human' ? 'Human Won' : 'Draw'}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                <input
                  id="notes"
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-1 bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)] text-text p-2.5 rounded-xl"
                />
              </div>
              <div className="btns flex flex-wrap gap-2.5">
                <button className="primary" onClick={handleAddMatch}>
                  Record Match
                </button>
                <button className="ghost" onClick={handleReset}>
                  Reset All
                </button>
                <button className="ghost" onClick={handleSample}>
                  Add 10 Sample Matches
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg">Recent Matches</h2>
              <div className="table-wrap overflow-auto rounded-xl border border-[rgba(255,255,255,.06)]">
                <table className="w-full border-collapse min-w-[720px]">
                  <thead className="bg-[rgba(255,255,255,.04)]">
                    <tr>
                      <th className="p-3.5 text-left text-sm"> # </th>
                      <th className="p-3.5 text-left text-sm"> Date & Time </th>
                      <th className="p-3.5 text-left text-sm"> Winner </th>
                      <th className="p-3.5 text-left text-sm"> Notes </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i} className="hover:bg-[rgba(255,255,255,.03)]">
                        <td className="p-3.5 text-sm">{i + 1}</td>
                        <td className="p-3.5 text-sm">{tsToStr(m.ts)}</td>
                        <td className="p-3.5 text-sm">
                          <span
                            className={`pill ${
                              m.winner === 'AI' ? 'ai' : m.winner === 'Human' ? 'human' : 'draw'
                            }`}
                          >
                            {m.winner}
                          </span>
                        </td>
                        <td className="p-3.5 text-sm">{m.notes || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-muted text-center p-5 text-xs">
        Built for quick tracking of Hand Cricket outcomes. Data is stored in your browser (localStorage).
      </footer>
    </div>
  );
};

export default Records;