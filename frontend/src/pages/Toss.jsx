import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";
//import cbg from "/HomeBg.jpg";
import "./Toss.scss";

// --- Coin 3D Component ---
const Coin = ({ isFlipping, result }) => {
  const coinRef = useRef();

  // Animate spinning during toss
  useFrame(() => {
    if (isFlipping && coinRef.current) {
      coinRef.current.rotation.x += 0.3;
      coinRef.current.rotation.y += 0.2;
    }
  });

  // End animation: face the correct result
  useEffect(() => {
    if (!isFlipping && coinRef.current && result) {
      gsap.to(coinRef.current.rotation, {
        x: result === "Heads" ? Math.PI / 2 : -Math.PI / 2,
        y: 0,
        z: 0,
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

      <Text position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        H
      </Text>
      <Text position={[0, -0.11, 0]} rotation={[Math.PI / 2, Math.PI, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        T
      </Text>
    </group>
  );
};

// --- Toss Component ---
const Toss = () => {
  const navigate = useNavigate();

  // Game Setup state
  const [overs, setOvers] = useState(null);
  const [wickets, setWickets] = useState(null);
  const [step, setStep] = useState("setup");

  // Toss state
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [showBatBowl, setShowBatBowl] = useState(false);

  // --- Setup Options ---
  const oversOptions = [1, 2, 5, 10, "Unlimited"];
  const wicketsOptions = [1, 3, 5, 10, "Unlimited"];

  const handleOversSelect = (o) => {
    if (o === "Unlimited" && wickets === "Unlimited") {
      toast.error("Cannot select Unlimited overs and Unlimited wickets at the same time!");
      return;
    }
    setOvers(o);
  };

  const handleWicketsSelect = (w) => {
    if (w === "Unlimited" && overs === "Unlimited") {
      toast.error("Cannot select Unlimited overs and Unlimited wickets at the same time!");
      return;
    }
    setWickets(w);
  };

  const handleProceedToToss = () => {
    if (overs && wickets) setStep("toss");
  };

  // --- Toss Functions ---
  const handleStart = () => {
    setShowChoice(true);
    setResult(null);
    setUserChoice(null);
    setShowBatBowl(false);
  };

  const handleUserChoiceToss = (choice) => {
    setUserChoice(choice);
    setShowChoice(false);
    setIsFlipping(true);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "Heads" : "Tails";
      setIsFlipping(false);
      setResult(outcome);

      if (choice === outcome) {
        setShowBatBowl(true); // User wins → show Bat/Bowl choice
      } else {
        const randomChoice = Math.random() > 0.5 ? "Batting" : "Bowling"; // User loses
        localStorage.setItem(
          "cricketGameSettings",
          JSON.stringify({ overs, wickets, userBatsFirst: randomChoice === "Bowling" })
        );
        setTimeout(() => navigate("/game"), 1000);
      }
    }, 3000);
  };

  const handleBatBowlChoice = (choice) => {
    localStorage.setItem(
      "cricketGameSettings",
      JSON.stringify({ overs, wickets, userBatsFirst: choice === "Batting" })
    );
    navigate("/game");
  };

  // --- Render Setup ---
  const renderSetup = () => (
    <div className="setup-container">
      <Toaster position="top-center" reverseOrder={false} />
      <h2>Game Setup</h2>

      <div className="options-group">
        <h3>Select Overs</h3>
        <div className="options-buttons">
          {oversOptions.map((o) => (
            <button
              key={o}
              onClick={() => handleOversSelect(o)}
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
          {wicketsOptions.map((w) => (
            <button
              key={w}
              onClick={() => handleWicketsSelect(w)}
              className={`option-btn ${wickets === w ? "active" : ""}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <button className="proceed-btn" onClick={handleProceedToToss} disabled={!overs || !wickets}>
        Proceed to Toss
      </button>
    </div>
  );

  // --- Render Toss ---
  const renderToss = () => (
    <>
      <h2>Coin Toss</h2>
      <div className="coin-box">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Coin isFlipping={isFlipping} result={result} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="result-box">
        {!showChoice && !userChoice && !result && !isFlipping && (
          <button onClick={handleStart}>Toss Coin</button>
        )}

        {showChoice && (
          <div className="choice-buttons">
            <button onClick={() => handleUserChoiceToss("Heads")}>Heads</button>
            <button onClick={() => handleUserChoiceToss("Tails")}>Tails</button>
          </div>
        )}

        {isFlipping && (
          <p className="toss-message">Toss ongoing...</p>
        )}

        {result && !isFlipping && (
          <p className="toss-message">
            Result: <span className={result.toLowerCase()}>{result}</span>{" "}
            {userChoice && `(You chose: ${userChoice})`}
          </p>
        )}

        {showBatBowl && (
          <div className="choice-buttons">
            <button onClick={() => handleBatBowlChoice("Batting")}>Batting</button>
            <button onClick={() => handleBatBowlChoice("Bowling")}>Bowling</button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="toss-container" style={{ backgroundImage: `url(${cbg})` }}>
      {step === "setup" ? renderSetup() : renderToss()}
    </div>
  );
};

export default Toss;
