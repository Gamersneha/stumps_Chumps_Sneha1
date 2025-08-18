import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

// --- STYLES ---
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
  .toss-container { height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; background-size: cover; background-position: center; background-attachment: fixed; color: white; font-family: "Poppins", sans-serif; text-align: center; padding: 1rem; box-sizing: border-box; }
  .toss-container h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8); letter-spacing: 1px; }
  .setup-container { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; padding: 2.5rem 3rem; background: rgba(0, 0, 0, 0.6); border: 2px solid rgba(245, 197, 66, 0.5); border-radius: 20px; box-shadow: 0 0 25px rgba(245, 197, 66, 0.4); }
  .options-group { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
  .options-group h3 { font-size: 1.5rem; font-weight: 600; color: #f5c542; text-shadow: 0 0 8px rgba(245, 197, 66, 0.7); }
  .options-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .option-btn { padding: 0.7rem 1.5rem; font-size: 1rem; font-weight: 600; background: rgba(255, 255, 255, 0.1); border: 2px solid #f5c542; border-radius: 12px; cursor: pointer; color: white; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: all 0.3s ease; }
  .option-btn:hover { background: rgba(245, 197, 66, 0.3); transform: scale(1.05); }
  .option-btn.active { background: linear-gradient(135deg, #f5c542, #ffd95c); color: #000; transform: scale(1.05); box-shadow: 0 0 15px rgba(245, 197, 66, 0.8); }
  .proceed-btn { margin-top: 1rem; padding: 0.8rem 2.5rem; font-size: 1.2rem; font-weight: 700; background: linear-gradient(135deg, #f5c542, #ffd95c); border: none; border-radius: 12px; cursor: pointer; color: #000; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); transition: all 0.3s ease; }
  .proceed-btn:hover { transform: scale(1.05); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6); }
  .proceed-btn:disabled { background: #444; color: #888; cursor: not-allowed; transform: scale(1); box-shadow: none; }
  .coin-box { width: 320px; height: 320px; background: rgba(0, 0, 0, 0.5); border: 2px solid rgba(245, 197, 66, 0.6); border-radius: 20px; box-shadow: 0 0 25px rgba(245, 197, 66, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
  .coin-box:hover { transform: scale(1.02); }
  .result-box { min-height: 120px; margin-top: 1rem; padding: 1.5rem 2rem; background: rgba(0, 0, 0, 0.4); border-radius: 15px; box-shadow: 0 0 15px rgba(245, 197, 66, 0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .result-box .toss-message { font-size: 1.5rem; font-weight: bold; color: #f5c542; text-shadow: 0px 0px 10px rgba(245, 197, 66, 0.8); }
  .result-box button { padding: 0.7rem 2rem; font-size: 1.1rem; font-weight: 600; background: linear-gradient(135deg, #f5c542, #ffd95c); border: none; border-radius: 12px; cursor: pointer; color: #000; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); transition: all 0.3s ease; }
  .result-box button:hover { background: linear-gradient(135deg, #ffd95c, #f5c542); transform: scale(1.08); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6); }
  .result-box button:active { transform: scale(0.95); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.7); }
  .choice-buttons { display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: center; }
  .choice-buttons h3 { margin-bottom: 0.5rem; font-size: 1.2rem; }
  .choice-buttons > div { display: flex; gap: 1rem; }
  @media (max-width: 768px) {
    .toss-container { gap: 1.5rem; }
    .toss-container h2 { font-size: 2rem; }
    .setup-container { padding: 2rem 1.5rem; gap: 2rem; }
    .options-group h3 { font-size: 1.2rem; }
    .coin-box { width: 250px; height: 250px; }
    .result-box .toss-message { font-size: 1.2rem; }
    .result-box button { font-size: 1rem; padding: 0.6rem 1.5rem; }
  }
`;

const Coin = ({ isFlipping, result }) => {
  const coinRef = useRef();

  useFrame(() => {
    if (isFlipping && coinRef.current) {
      coinRef.current.rotation.x += 0.3;
      coinRef.current.rotation.y += 0.2;
    }
  });

  useEffect(() => {
    // Ensure GSAP is available before using it
    if (!isFlipping && coinRef.current && result && window.gsap) {
      window.gsap.set(coinRef.current.rotation, {
        x: coinRef.current.rotation.x % (2 * Math.PI),
        y: coinRef.current.rotation.y % (2 * Math.PI),
        z: 0,
      });
      window.gsap.to(coinRef.current.rotation, {
        x: result === "Heads" ? Math.PI / 2 : -Math.PI / 2,
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [isFlipping, result]);

  return (
    <group ref={coinRef}>
      <mesh>
        <cylinderGeometry args={[1, 1, 0.2, 64]} />
        <meshStandardMaterial color="#f5c542" metalness={0.6} roughness={0.3} />
      </mesh>
      <Text
        position={[0, 0.11, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        H
      </Text>
      <Text
        position={[0, -0.11, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        T
      </Text>
    </group>
  );
};

const Toss = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("setup");
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [showBatBowl, setShowBatBowl] = useState(false);
  const [tossMessage, setTossMessage] = useState("");

  const handleProceedToToss = () => {
    if (overs && wickets) setStep("toss");
  };

  const handleStartToss = () => {
    setShowChoiceButtons(true);
    setResult(null);
    setShowBatBowl(false);
    setTossMessage("");
  };

  const handleUserChoice = (choice) => {
    setShowChoiceButtons(false);
    setIsFlipping(true);
    setTossMessage("Flipping...");

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "Heads" : "Tails";
      setIsFlipping(false);
      setResult(outcome);

      if (choice === outcome) {
        setTossMessage(`It's ${outcome}. You won the toss!`);
        setShowBatBowl(true);
      } else {
        setTossMessage(`It's ${outcome}. You lost the toss.`);
        const randomChoice = Math.random() > 0.5 ? "Batting" : "Bowling";
        const userBatsFirst = randomChoice === "Bowling";
        localStorage.setItem(
          "cricketGameSettings",
          JSON.stringify({ overs, wickets, userBatsFirst })
        );
        setTimeout(() => navigate("/game"), 2000);
      }
    }, 3000);
  };

  const handleBatBowlChoice = (choice) => {
    const userBatsFirst = choice === "Batting";
    localStorage.setItem(
      "cricketGameSettings",
      JSON.stringify({ overs, wickets, userBatsFirst })
    );
    navigate("/game");
  };

  const renderSetup = () => (
    <div className="setup-container">
      <h2>Game Setup</h2>
      <div className="options-group">
        <h3>Select Overs</h3>
        <div className="options-buttons">
          {[2, 5, 10, "Unlimited"].map((o) => (
            <button
              key={o}
              onClick={() => setOvers(o)}
              className={`option-btn ${overs === o ? "active" : ""}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="options-group">
        <h3>Select Wickets</h3>
        <div className="options-buttons">
          {[1, 3, 5, 10].map((w) => (
            <button
              key={w}
              onClick={() => setWickets(w)}
              className={`option-btn ${wickets === w ? "active" : ""}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <button
        className="proceed-btn"
        onClick={handleProceedToToss}
        disabled={!overs || !wickets}
      >
        Proceed to Toss
      </button>
    </div>
  );

  const renderToss = () => (
    <>
      <h2>Coin Toss</h2>
      <div className="coin-box">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <Coin isFlipping={isFlipping} result={result} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <div className="result-box">
        {!showChoiceButtons && !result && !isFlipping && (
          <button onClick={handleStartToss}>Toss Coin</button>
        )}
        {showChoiceButtons && (
          <div className="choice-buttons">
            <h3>Choose Heads or Tails</h3>
            <div>
              <button onClick={() => handleUserChoice("Heads")}>Heads</button>
              <button onClick={() => handleUserChoice("Tails")}>Tails</button>
            </div>
          </div>
        )}
        {tossMessage && <p className="toss-message">{tossMessage}</p>}
        {showBatBowl && (
          <div className="choice-buttons">
            <h3>You won! What do you want to do?</h3>
            <div>
              <button onClick={() => handleBatBowlChoice("Batting")}>
                Batting
              </button>
              <button onClick={() => handleBatBowlChoice("Bowling")}>
                Bowling
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div
        className="toss-container"
        style={{
          backgroundImage: `url("/HomeBg.jpg")`,
        }}
      >
        {step === "setup" ? renderSetup() : renderToss()}
      </div>
    </>
  );
};

export default Toss;
