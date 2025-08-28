import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Link } from "react-router-dom";
import "../styles/home.scss";
import { motion, useScroll } from "framer-motion";
import * as THREE from "three";

import Loader from "./Loader";   // ✅ import your loader
import MatchHistory from "./History";
import Records from "./Records";
import Rules from "./Rules";

// Neon grid floor
const GridFloor = () => {
  return (
    <gridHelper
      args={[300, 60, new THREE.Color("#ff00ff"), new THREE.Color("#00ffff")]}
      position={[0, -10, 0]}
    />
  );
};

// Floating neon cubes (like 8bit.ai vibe)
const FloatingCubes = () => {
  const group = useRef();
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.002;
      group.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={group}>
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 20,
            (Math.random() - 0.5) * 40,
          ]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            emissive={i % 2 ? "#ff00ff" : "#00ffff"}
            emissiveIntensity={2}
            color={"black"}
          />
        </mesh>
      ))}
    </group>
  );
};

// Camera scroll effect
const ScrollCamera = ({ scroll }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.z = 15 - scroll.current / 100;
      ref.current.position.y = 5 - scroll.current / 200;
    }
  });
  return <perspectiveCamera ref={ref} fov={70} near={0.1} far={1000} />;
};

const Home = () => {
  const [nickname, setNickname] = useState("Player1");
  const [loading, setLoading] = useState(true); // ✅ loader state
  const scrollRef = useRef(0);

  // Framer Motion scroll tracking
  const { scrollY } = useScroll();
  scrollY.on("change", (latest) => {
    scrollRef.current = latest;
  });

  // simulate loading time (you can replace with asset loading logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 sec loader
    return () => clearTimeout(timer);
  }, []);

  // ✅ Show loader first
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-page" style={{ position: "relative" }}>
      {/* 3D Background covering entire page */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Canvas>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 20, 10]} intensity={2} color="#ff00ff" />
          <Stars radius={200} depth={60} count={4000} factor={4} fade />
          <GridFloor />
          <FloatingCubes />
          <ScrollCamera scroll={scrollRef} />
        </Canvas>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="neon-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          🎮 Stumps & Chumps 🎮
        </motion.h1>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link to="/toss" className="neon-button big-btn">
            Play with AI
          </Link>
        </motion.div>
      </motion.section>

      {/* Match History Section */}
      <motion.section
        className="match-history section-card"
        style={{ minHeight: "100vh", padding: "50px" }}
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="career-title">Match History</h2>
        <MatchHistory nickname={nickname} />
      </motion.section>

      {/* Records Section */}
      <motion.section
        className="records section-card"
        style={{ minHeight: "100vh", padding: "50px" }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="career-title">Records</h2>
        <Records />
      </motion.section>

      {/* Rules Section */}
      <motion.section
        className="rules section-card"
        style={{ minHeight: "100vh", padding: "50px" }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="career-title">Rules</h2>
        <Rules />
      </motion.section>
    </div>
  );
};

export default Home;
