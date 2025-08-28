import { useEffect, useState } from "react";

const Loader = () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");


        .audiowide-regular {
    font-family: "VT323", monospace;
          font-weight: 400;
          font-style: normal;
        }

        .loader-wrap {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 1s ease, visibility 1s ease;
        }

        .loader-wrap.fade-out {
          opacity: 0;
          visibility: hidden;
        }

        .loader-content {
          position: relative;
          width: 220px; /* Increased */
          height: 220px; /* Increased */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem; /* Bigger text */
          color: #fff;
          flex-direction: column;
          text-align: center;
          line-height: 1.4;
          letter-spacing: 1px;
        }

        /* Arc loader */
        .loader-circle {
          position: absolute;
          width: 200px; /* Increased */
          height: 200px; /* Increased */
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #fff 0deg,
            #fff 20deg,
            transparent 20deg,
            transparent 360deg
          );
          mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black 100%);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black 100%);
          animation: spin 0.8s linear infinite, arcLength 1.6s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #ffffff);
        }

        /* Faster rotation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Animate arc length */
        @keyframes arcLength {
          0% {
            background: conic-gradient(
              from 0deg,
              #fff 0deg,
              #fff 20deg,
              transparent 20deg,
              transparent 360deg
            );
          }
          50% {
            background: conic-gradient(
              from 0deg,
              #fff 0deg,
              #fff 80deg,
              transparent 80deg,
              transparent 360deg
            );
          }
          100% {
            background: conic-gradient(
              from 0deg,
              #fff 0deg,
              #fff 40deg,
              transparent 40deg,
              transparent 360deg
            );
          }
        }
      `}</style>

      <div
        className={`loader-wrap ${hide ? "fade-out" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="loader-content audiowide-regular">
          <div className="loader-circle"></div>
          <span>Stumps</span>
          <span>Chumps</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
