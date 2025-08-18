import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import gsap from "gsap";
import "./Toss.scss";
import cbg from "/HomeBg.jpg";

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
      if (result === "Heads") {
        gsap.to(coinRef.current.rotation, {
          x: Math.PI / 2,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(coinRef.current.rotation, {
          x: -Math.PI / 2,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.out",
        });
      }
    }
  }, [isFlipping, result]);

  return (
    <group ref={coinRef}>
      {/* Coin body */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.2, 64]} />
        <meshStandardMaterial color="#f5c542" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Heads text */}
      <Text
        position={[0, 0.11, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        H
      </Text>

      {/* Tails text */}
      <Text
        position={[0, -0.11, 0]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        fontSize={0.5}
        color="white"
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [showBatBowl, setShowBatBowl] = useState(false);

  const handleStart = () => {
    setShowChoice(true);
    setResult(null);
    setUserChoice(null);
    setShowBatBowl(false);
  };

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    setShowChoice(false);
    setIsFlipping(true);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "Heads" : "Tails";
      setIsFlipping(false);
      setResult(outcome);

      if (choice === outcome) {
        // User wins → show Bat/Bowl choice
        setShowBatBowl(true);
      } else {
        // User loses → randomly pick Bat/Bowl and redirect
        const randomChoice = Math.random() > 0.5 ? "Batting" : "Bowling";
        setTimeout(() => {
          navigate("/game", {
            state: { choice: randomChoice, wonToss: false },
          });
        }, 1000); // delay to show result briefly
      }
    }, 3000);
  };

  const handleBatBowlChoice = (choice) => {
    navigate("/game", { state: { choice, wonToss: true } });
  };

  return (
    <div className="toss-container" style={{ backgroundImage: `url(${cbg})` }}>
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
        {/* Initial Toss Button */}
        {!showChoice && !userChoice && !result && (
          <button onClick={handleStart}>Toss Coin</button>
        )}

        {/* User Choice: Heads/Tails */}
        {showChoice && (
          <div className="choice-buttons">
            <button onClick={() => handleUserChoice("Heads")}>Heads</button>
            <button onClick={() => handleUserChoice("Tails")}>Tails</button>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <p>
            Result: <span className="result">{result}</span>{" "}
            {userChoice && `(You chose: ${userChoice})`}
          </p>
        )}

        {/* Batting/Bowling Choice if user wins */}
        {showBatBowl && (
          <div className="choice-buttons">
            <button onClick={() => handleBatBowlChoice("Batting")}>
              Batting
            </button>
            <button onClick={() => handleBatBowlChoice("Bowling")}>
              Bowling
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toss;
