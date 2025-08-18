import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import zero from "/hand_0.png";
import two from "/hand_2.png";
import three from "/hand_3.png";
import four from "/hand_4.png";
import five from "/hand_5.png";
import six from "/hand_6.png";

// The key for storing the match history log
const STORAGE_KEY = "handCricketMatchLog_v2";

// Styles remain the same
const styles = {
  gameContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: "100vh",
    width: "100vw",
    fontFamily: "sans-serif",
    padding: "1rem",
    boxSizing: "border-box",
    backgroundImage: `url("/HomeBg.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
    position: "relative",
  },
  topBar: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    zIndex: 10,
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  settingsBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
  },
  goBackBtn: {
    background: "rgba(0, 0, 0, 0.4)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    backdropFilter: "blur(5px)",
  },
  mainArea: {
    display: "flex",
    gap: "30rem",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
  },
  gameColumn: {
    flex: "0 1 30%",
    maxWidth: "30%",
    display: "flex",
    flexDirection: "column",
  },
  playerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "white",
    textShadow: "1px 1px 2px black",
  },
  circle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  aiCard: {
    flex: 1,
    aspectRatio: "1 / 1",
    backgroundColor: "rgba(10, 10, 10, 0.8)",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  playerCard: {
    flex: 1,
    aspectRatio: "1 / 1",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "15px",
    boxShadow: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0fa, 0 0 20px #0fa",
    border: "2px solid #fff",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "5rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "20px",
    padding: "1rem 2rem",
    zIndex: 10,
  },
  scoreboard: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "1.5rem 1rem",
    borderRadius: "10px",
    fontWeight: "bold",
    flexWrap: "wrap",
    gap: "1rem",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingTop: "0.5rem",
  },
  controls: {
    textAlign: "center",
  },
  playButton: {
    padding: "0.8rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4CAF50",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background-color 0.3s",
  },
  resultsContainer: {
    textAlign: "center",
    minHeight: "25px",
  },
  resultsText: {
    fontSize: "1.1rem",
    color: "white",
    textShadow: "1px 1px 2px black",
  },
  outMessage: {
    color: "#4CAF50",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

const handImages = {
  0: zero,
  2: two,
  3: three,
  4: four,
  5: five,
  6: six,
};

const Game = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [nickname] = useState(
    () => localStorage.getItem("nickname") || "Player1"
  );
  const [avatar] = useState(() => localStorage.getItem("avatar") || null);
  const aiAvatar = "https://api.dicebear.com/9.x/bottts/svg";

  const getInitialMatchState = () => ({
    inning: 1,
    target: 0,
    gameOver: false,
    matchResult: "",
    firstInning: { runs: 0, overs: 0.0, totalBalls: 0 },
    currentInning: {
      teamRuns: 0,
      wickets: 0,
      totalBalls: 0,
      overs: 0.0,
      runRate: 0.0,
    },
  });

  const [match, setMatch] = useState(() => {
    const savedMatch = localStorage.getItem("cricketMatch");
    return savedMatch ? JSON.parse(savedMatch) : getInitialMatchState();
  });

  const [countdown, setCountdown] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("cricketMatch", JSON.stringify(match));
  }, [match]);

  const performExit = useCallback(
    (path) => {
      localStorage.removeItem("cricketMatch");
      navigate(path);
    },
    [navigate]
  );

  const confirmExit = useCallback(
    (path) => {
      toast(
        (t) => (
          <div style={{ padding: "10px", textAlign: "center" }}>
            <p style={{ margin: "0 0 10px 0" }}>
              Are you sure you want to leave? Your progress will be lost.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  performExit(path);
                }}
                style={{
                  ...styles.playButton,
                  backgroundColor: "#f44336",
                  padding: "8px 16px",
                  fontSize: "1rem",
                }}
              >
                Leave
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                  ...styles.playButton,
                  backgroundColor: "#6c757d",
                  padding: "8px 16px",
                  fontSize: "1rem",
                }}
              >
                Stay
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          id: "exit-confirmation",
        }
      );
    },
    [performExit]
  );

  useEffect(() => {
    const handlePopState = (event) => {
      if (match.currentInning.totalBalls > 0 && !match.gameOver) {
        window.history.pushState(null, "", window.location.href);
        confirmExit(-1);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [match.gameOver, match.currentInning.totalBalls, confirmExit]);

  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Error accessing webcam:", err);
        }
      }
    }
    setupCamera();
  }, []);

  const calculateOvers = (balls) => {
    if (balls === 0) return 0.0;
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return parseFloat(`${overs}.${remainingBalls}`);
  };

  const startGame = () => {
    if (match.gameOver) return;
    setIsGameActive(true);
    setUserChoice(null);
    setAiChoice(null);
    setCountdown(5);

    let timer = 5;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        captureAndSend();
        setIsGameActive(false);
      }
    }, 1000);
  };

  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL("image/jpeg");
    if (!imageSrc) return console.error("Failed to capture image.");
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "hand.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const userPred = parseInt(res.data.result, 10);
      const aiPred = Math.floor(Math.random() * 7); // 0-6
      setUserChoice(userPred.toString());
      setAiChoice(aiPred.toString());
      updateMatch(userPred, aiPred);
    } catch (err) {
      console.error("Error detecting hand:", err);
      // Fallback logic
      const userPred = Math.floor(Math.random() * 6) + 1;
      const aiPred = Math.floor(Math.random() * 7);
      setUserChoice(userPred.toString());
      setAiChoice(aiPred.toString());
      updateMatch(userPred, aiPred);
    }
  };

  const saveMatchRecord = (finalState) => {
    try {
      const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      let winner;
      if (finalState.matchResult.includes("YOU WON")) {
        winner = "Human";
      } else if (finalState.matchResult.includes("MR. AI WON")) {
        winner = "AI";
      } else {
        winner = "Draw";
      }

      // In inning 2, currentInning is AI's batting. firstInning is Human's.
      const newRecord = {
        winner,
        humanScore: finalState.firstInning.runs,
        humanBalls: finalState.firstInning.totalBalls,
        aiScore: finalState.currentInning.teamRuns,
        aiBalls: finalState.currentInning.totalBalls,
        date: new Date().toISOString(),
      };

      log.push(newRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
      toast.success("Match record saved!");
    } catch (error) {
      console.error("Failed to save match record:", error);
      toast.error("Could not save match record.");
    }
  };

  const updateMatch = (userNum, aiNum) => {
    setMatch((prev) => {
      if (prev.gameOver) return prev;
      const newState = JSON.parse(JSON.stringify(prev));
      const current = newState.currentInning;
      current.totalBalls += 1;
      if (newState.inning === 1) {
        if (userNum === aiNum) {
          toast.success(
            `Inning 1 Over! You scored ${
              current.teamRuns
            }. Target to defend is ${current.teamRuns + 1}!`,
            { duration: 5000, icon: "🏏" }
          );
          newState.inning = 2;
          newState.target = current.teamRuns + 1;
          newState.firstInning = {
            runs: current.teamRuns,
            overs: calculateOvers(current.totalBalls),
            totalBalls: current.totalBalls, // Store total balls for stats
          };
          newState.currentInning = getInitialMatchState().currentInning;
        } else {
          if (userNum !== 0) {
            current.teamRuns += userNum;
          }
        }
      } else {
        if (userNum === aiNum) {
          newState.gameOver = true;
          const runsNeeded = newState.target - current.teamRuns;
          newState.matchResult = `YOU WON! You defended the target and won by ${
            runsNeeded - 1
          } runs.`;
          saveMatchRecord(newState); // Save record on win
        } else {
          if (aiNum !== 0) {
            current.teamRuns += aiNum;
          }
          if (current.teamRuns >= newState.target) {
            newState.gameOver = true;
            newState.matchResult = "MR. AI WON! Better luck next time.";
            saveMatchRecord(newState); // Save record on loss
          }
        }
      }
      current.overs = calculateOvers(current.totalBalls);
      if (current.totalBalls > 0) {
        current.runRate = ((current.teamRuns / current.totalBalls) * 6).toFixed(
          2
        );
      }
      return newState;
    });
  };

  const resetGame = () => {
    setMatch(getInitialMatchState());
    setUserChoice(null);
    setAiChoice(null);
    setCountdown(null);
    localStorage.removeItem("cricketMatch");
  };

  const handleSettings = () => {
    if (match.currentInning.totalBalls > 0 && !match.gameOver) {
      confirmExit("/history");
    } else {
      navigate("/history");
    }
  };

  const handleGoBack = () => {
    if (match.currentInning.totalBalls > 0 && !match.gameOver) {
      confirmExit(-1);
    } else {
      navigate(-1);
    }
  };

  const isUserBatting = match.inning === 1;
  const currentScore = match.currentInning;
  const buttonText = match.gameOver
    ? "Play Again"
    : isUserBatting
    ? "Play"
    : "Bowl";
  const batterName = isUserBatting ? nickname : "Mr. AI";

  return (
    <div style={styles.gameContainer}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={styles.topBar}>
        <button style={styles.goBackBtn} onClick={handleGoBack}>
          Go Back
        </button>
        <button style={styles.settingsBtn} onClick={handleSettings}>
          <Settings size={32} />
        </button>
      </div>

      <div style={styles.mainArea}>
        <div style={styles.gameColumn}>
          <div style={styles.playerBox}>
            <div style={styles.circle}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="User Avatar"
                  style={styles.avatarImage}
                />
              ) : isUserBatting ? (
                "🏏"
              ) : (
                "🎯"
              )}
            </div>
            <span>
              {nickname} ({isUserBatting ? "Batting" : "Bowling"})
            </span>
          </div>
          <div style={styles.playerCard}>
            {countdown !== null && countdown > 0 && (
              <div style={styles.countdownOverlay}>{countdown}</div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        </div>

        <div style={styles.gameColumn}>
          <div style={styles.playerBox}>
            <span>Mr. AI ({isUserBatting ? "Bowling" : "Batting"})</span>
            <div style={styles.circle}>
              <img src={aiAvatar} alt="AI Avatar" style={styles.avatarImage} />
            </div>
          </div>
          <div style={styles.aiCard}>
            <span
              style={{
                fontSize: "8rem",
                color: "white",
                textShadow: "0 0 10px #fff",
              }}
            >
              {aiChoice !== null ? (
                handImages[aiChoice] ? (
                  <img
                    src={handImages[aiChoice]}
                    alt={`AI chose ${aiChoice}`}
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "5rem", color: "white" }}>
                    {aiChoice}
                  </span> // fallback if no image
                )
              ) : (
                <span style={{ fontSize: "5rem", color: "white" }}>?</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.bottomContainer}>
        <div style={styles.controls}>
          <button
            onClick={match.gameOver ? resetGame : startGame}
            disabled={isGameActive}
            style={{
              ...styles.playButton,
              backgroundColor: match.gameOver ? "#f44336" : "#4CAF50",
            }}
          >
            {buttonText}
          </button>
        </div>

        <div style={styles.resultsContainer}>
          {userChoice && (
            <p style={styles.resultsText}>
              You Played: {userChoice} | AI Played: {aiChoice}
            </p>
          )}
          {match.gameOver && (
            <h2 style={styles.outMessage}>{match.matchResult}</h2>
          )}
        </div>

        <div style={styles.scoreboard}>
          {match.inning === 2 && <span>TARGET: {match.target}</span>}
          <span>
            {batterName}: {currentScore.teamRuns}-{currentScore.wickets} (
            {currentScore.overs} OVERS)
          </span>
          <span>RUN RATE: {currentScore.runRate}</span>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Game;
