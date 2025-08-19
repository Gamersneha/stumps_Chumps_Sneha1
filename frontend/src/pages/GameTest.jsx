import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import zero from "../utils/hand 0.jpg";
import two from "../utils/hand 2.jpg";
import three from "../utils/hand 3.jpg";
import four from "../utils/hand 4.jpg";
import five from "../utils/hand 5.jpg";
import six from "../utils/hand 6.jpg";

const STORAGE_KEY = "handCricketMatchLog_v2";

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
    backgroundImage: `url('/HomeBg.jpg')`,
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
  neonCircleOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "60%",
    borderRadius: "50%",
    border: "3px solid #0fa",
    boxShadow: "0 0 5px #0fa, 0 0 10px #0fa, 0 0 20px #0fa, 0 0 30px #0fa",
    zIndex: 5,
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

  const [gameSettings, setGameSettings] = useState(null);

  const getInitialMatchState = () => ({
    inning: 1,
    target: 0,
    gameOver: false,
    matchResult: "",
    firstInning: { runs: 0, wickets: 0, totalBalls: 0 },
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
    const settingsData = localStorage.getItem("cricketGameSettings");
    if (settingsData) {
      setGameSettings(JSON.parse(settingsData));
    } else {
      toast.error("No game settings found. Redirecting to setup.", {
        id: "settings-error-toast",
      });
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  useEffect(() => {
    if (gameSettings) {
      localStorage.setItem("cricketMatch", JSON.stringify(match));
    }
  }, [match, gameSettings]);

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

  // --- MODIFIED FUNCTION ---
  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Determine the largest possible square that can be cropped from the center.
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const cropSize = Math.min(videoWidth, videoHeight);

    // Calculate the top-left corner (sx, sy) of the crop area to keep it centered.
    const sx = (videoWidth - cropSize) / 2;
    const sy = (videoHeight - cropSize) / 2;

    // Set the canvas to be a square of that size.
    canvas.width = cropSize;
    canvas.height = cropSize;

    const context = canvas.getContext("2d");

    // Draw only the cropped, central square part of the video onto the canvas.
    context.drawImage(
      video,
      sx,
      sy,
      cropSize,
      cropSize,
      0,
      0,
      cropSize,
      cropSize
    );

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
      const aiPred = Math.floor(Math.random() * 7);
      setUserChoice(userPred.toString());
      setAiChoice(aiPred.toString());
      updateMatch(userPred, aiPred);
    } catch (err) {
      console.error("Error detecting hand:", err);
      const userPred = Math.floor(Math.random() * 6) + 1;
      const aiPred = Math.floor(Math.random() * 7);
      setUserChoice(userPred.toString());
      setAiChoice(aiPred.toString());
      updateMatch(userPred, aiPred);
    }
  };
  // --- END OF MODIFICATION ---

  const saveMatchRecord = (finalState, settings) => {
    try {
      const log = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const { userBatsFirst } = settings;

      let winner;
      if (finalState.matchResult.includes(nickname.toUpperCase())) {
        winner = "Human";
      } else if (finalState.matchResult.includes("MR. AI")) {
        winner = "AI";
      } else {
        winner = "Draw";
      }

      const humanScore = userBatsFirst
        ? finalState.firstInning.runs
        : finalState.currentInning.teamRuns;
      const humanBalls = userBatsFirst
        ? finalState.firstInning.totalBalls
        : finalState.currentInning.totalBalls;
      const aiScore = !userBatsFirst
        ? finalState.firstInning.runs
        : finalState.currentInning.teamRuns;
      const aiBalls = !userBatsFirst
        ? finalState.firstInning.totalBalls
        : finalState.currentInning.totalBalls;

      const humanWickets = userBatsFirst
        ? finalState.currentInning.wickets
        : finalState.firstInning.wickets;
      const aiWickets = userBatsFirst
        ? finalState.firstInning.wickets
        : finalState.currentInning.wickets;

      const newRecord = {
        winner,
        humanScore,
        humanBalls,
        aiScore,
        aiBalls,
        humanWickets,
        aiWickets,
        date: new Date().toISOString(),
      };

      log.push(newRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
      toast.success("Match record saved!", { id: "save-record-toast" });
    } catch (error) {
      console.error("Failed to save match record:", error);
      toast.error("Could not save match record.", { id: "save-error-toast" });
    }
  };

  const updateMatch = (userNum, aiNum) => {
    if (!gameSettings) return;

    setMatch((prev) => {
      if (prev.gameOver) return prev;

      const newState = JSON.parse(JSON.stringify(prev));
      const current = newState.currentInning;

      const isUserBattingNow =
        (newState.inning === 1 && gameSettings.userBatsFirst) ||
        (newState.inning === 2 && !gameSettings.userBatsFirst);

      current.totalBalls += 1;
      const isOut = userNum === aiNum;
      let inningOver = false;

      if (isOut) {
        current.wickets += 1;
        if (current.wickets >= gameSettings.wickets) {
          inningOver = true;
        } else {
          toast.error("OUT!", {
            icon: "💥",
            id: "out-toast",
          });
        }
      } else {
        const runsScored = isUserBattingNow ? userNum : aiNum;
        if (runsScored !== 0) {
          current.teamRuns += runsScored;
        }
      }

      if (
        gameSettings.overs !== "Unlimited" &&
        current.totalBalls >= gameSettings.overs * 6
      ) {
        inningOver = true;
      }

      if (newState.inning === 2 && current.teamRuns >= newState.target) {
        newState.gameOver = true;
        const winner = isUserBattingNow ? nickname : "Mr. AI";
        const wicketsLeft = gameSettings.wickets - current.wickets;
        newState.matchResult = `${winner.toUpperCase()} WON! Chased the target with ${wicketsLeft} wickets in hand.`;
        saveMatchRecord(newState, gameSettings);
      } else if (inningOver) {
        if (newState.inning === 1) {
          toast.success(
            `Inning 1 Over! Score: ${current.teamRuns}/${
              current.wickets
            }. Target is ${current.teamRuns + 1}!`,
            {
              duration: 5000,
              icon: "🏏",
              id: "inning-over-toast",
            }
          );
          newState.inning = 2;
          newState.target = current.teamRuns + 1;
          newState.firstInning = { ...current };
          newState.currentInning = getInitialMatchState().currentInning;
        } else {
          newState.gameOver = true;
          if (current.teamRuns < newState.target - 1) {
            const winner = isUserBattingNow ? "Mr. AI" : nickname;
            const runsNeeded = newState.target - current.teamRuns;
            newState.matchResult = `${winner.toUpperCase()} WON by ${
              runsNeeded - 1
            } runs.`;
          } else if (current.teamRuns === newState.target - 1) {
            newState.matchResult = "MATCH DRAWN!";
          }
          saveMatchRecord(newState, gameSettings);
        }
      }

      current.overs = calculateOvers(current.totalBalls);
      current.runRate =
        current.totalBalls > 0
          ? ((current.teamRuns / current.totalBalls) * 6).toFixed(2)
          : 0.0;

      return newState;
    });
  };

  const resetGame = () => {
    localStorage.removeItem("cricketMatch");
    localStorage.removeItem("cricketGameSettings");
    navigate("/");
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

  if (!gameSettings) {
    return (
      <div style={styles.gameContainer}>
        <h1 style={{ color: "white" }}>Loading Game Settings...</h1>
        <Toaster />
      </div>
    );
  }

  const isUserBatting =
    (match.inning === 1 && gameSettings.userBatsFirst) ||
    (match.inning === 2 && !gameSettings.userBatsFirst);
  const batterName = isUserBatting ? nickname : "Mr. AI";
  const buttonText = match.gameOver
    ? "New Game"
    : isUserBatting
    ? "Play"
    : "Bowl";
  const currentScore = match.currentInning;

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
            <div style={styles.neonCircleOverlay}></div>
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
                  </span>
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
            {currentScore.overs})
          </span>
          <span>
            {gameSettings.overs !== "Unlimited"
              ? `OVERS: ${gameSettings.overs}`
              : "UNLIMITED OVERS"}
          </span>
          <span>WICKETS: {gameSettings.wickets}</span>
          <span>RUN RATE: {currentScore.runRate}</span>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Game;
