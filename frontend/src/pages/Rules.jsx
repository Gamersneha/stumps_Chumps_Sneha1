import React, { useEffect } from 'react';
import './Rules.css';

const Rules = () => {
  useEffect(() => {
    const rules = document.querySelectorAll(".rule-item");

    const showRulesOnScroll = () => {
      rules.forEach(rule => {
        const rect = rule.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !rule.classList.contains("visible")) {
          rule.classList.add("visible");
        }
      });
    };

    rules.forEach(rule => {
      rule.addEventListener("click", () => {
        rule.classList.toggle("active");
      });
    });

    window.addEventListener("scroll", showRulesOnScroll);
    showRulesOnScroll();

    return () => {
      window.removeEventListener("scroll", showRulesOnScroll);
      rules.forEach(rule => {
        rule.removeEventListener("click", () => {
          rule.classList.toggle("active");
        });
      });
    };
  }, []);

  return (
    <div className="min-h-screen text-white text-center font-poppins overflow-x-hidden">
      <div className="stadium-theme"></div>
      <div className="overlay"></div>

      <h1 className="page-title">🏏 Rules & Regulations</h1>

      <div className="rules-box">
        <h2>Batting Rules 🏏</h2>
        <ul className="rules-list">
          <li className="rule-item">
            ✋ Show a number (0–6) with your hand in front of the webcam.
            <div className="rule-desc">
              Each finger count = runs. ✌️ = 2 runs, ✋ = 5 runs, 👍 = 6 runs.
            </div>
          </li>
          <li className="rule-item">
            ❌ If your number matches the bowler’s, you are OUT.
            <div className="rule-desc">
              Example: You play 4️⃣, bowler also bowls 4️⃣ → you lose a wicket.
            </div>
          </li>
          <li className="rule-item">
            ➕ If your number does NOT match, you score runs.
            <div className="rule-desc">
              Non-matching inputs = runs added to your score.
            </div>
          </li>
          <li className="rule-item">
            ⏱️ If no gesture shown in 5 seconds → Dead Ball.
            <div className="rule-desc">
              Stay alert! Miss the timer = ball wasted, no runs scored.
            </div>
          </li>
        </ul>
      </div>

      <div className="rules-box">
        <h2>Bowling Rules 🎯</h2>
        <ul className="rules-list">
          <li className="rule-item">
            🎳 Show a number (0–6) as your delivery.
            <div className="rule-desc">
              This is your “ball.” AI batsman will play against your number.
            </div>
          </li>
          <li className="rule-item">
            🎯 If your number matches batsman’s → WICKET.
            <div className="rule-desc">
              Example: You bowl 2️⃣, batsman plays 2️⃣ → BOWLED!
            </div>
          </li>
          <li className="rule-item">
            ➖ If your number doesn’t match → runs conceded.
            <div className="rule-desc">
              Non-matching input means batsman scores that many runs.
            </div>
          </li>
          <li className="rule-item">
            ⏱️ If you don’t show in 5 seconds → Dead Ball.
            <div className="rule-desc">
              Failing to bowl in time wastes the delivery, ball replayed.
            </div>
          </li>
        </ul>
      </div>

      <div className="rules-box">
        <h2>Match Rules 🥇</h2>
        <ul className="rules-list">
          <li className="rule-item">
            🏆 Highest runs after both innings wins.
            <div className="rule-desc">
              Score more than your opponent across batting + bowling to be the champion!
            </div>
          </li>
          <li className="rule-item">
            🔥 Tie → Super Over.
            <div className="rule-desc">
              1 over shootout to decide the final winner.
            </div>
          </li>
        </ul>
        <a href="/" className="back-btn">⬅ Back to Home</a>
      </div>
    </div>
  );
};

export default Rules;