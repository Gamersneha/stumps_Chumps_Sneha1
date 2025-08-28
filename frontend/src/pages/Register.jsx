import React from "react";
import Spline from "@splinetool/react-spline";

export default function Register() {
  return (
    <div style={styles.wrapper}>
      {/* Form on left */}
      <div style={styles.formContainer}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Register</h2>
          <input type="text" placeholder="Username" style={styles.input} />
          <input type="email" placeholder="Email" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />
          <input
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
          />
          <button style={styles.button}>Register</button>
        </div>
      </div>

      {/* Robot on extreme right */}
      <div style={styles.robotContainer}>
        <Spline scene="https://prod.spline.design/eZM92A5-KJt2eKB8/scene.splinecode" />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#cfcadf", // same as robot background
    overflow: "hidden",
  },
  formContainer: {
    flex: "0 0 45%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "60px",
  },
  card: {
    backgroundColor: "#cfcadf",
    padding: "40px 50px", // even padding on left + right
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "400px",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c2c2c",
  },
  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #888",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box", // ensures padding fits within box width
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#005f73",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  robotContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
};
