import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // -------------------- BACKEND CALL (Commented Out) --------------------
    /*
    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("Login successful!");
          // maybe save token in localStorage / cookie
        } else {
          setStatus("Invalid username or password!");
        }
      })
      .catch((err) => setStatus("Error logging in!"));
    */

    // -------------------- FRONTEND ONLY (Simulated Login) --------------------
    if (formData.username === "admin" && formData.password === "1234") {
      setStatus("Login successful!");
    } else {
      setStatus("Invalid username or password!");
    }
  }

  // Styles similar to Register.jsx
  const styles = {
    wrapper: {
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#cfcadf",
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
      padding: "40px 50px",
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
      boxSizing: "border-box",
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
    status: {
      marginTop: "15px",
      fontSize: "0.9em",
      textAlign: "center",
      color: "red",
    },
    createAccount: {
      textAlign: "center",
      marginTop: "15px",
      fontSize: "0.9em",
    },
    link: {
      color: "#005f73",
      textDecoration: "none",
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

  return (
    <div style={styles.wrapper}>
      {/* Form on left */}
      <div style={styles.formContainer}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
            <p style={styles.status}>{status}</p>

            <p style={styles.createAccount}>
              Don&apos;t have an account?{" "}
              <a href="/register" style={styles.link}>
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Robot on extreme right */}
      <div style={styles.robotContainer}>
        <Spline scene="https://prod.spline.design/eZM92A5-KJt2eKB8/scene.splinecode" />
      </div>
    </div>
  );
}
