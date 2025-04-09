import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.status === 201) {
        setMsg("Registration successful! You can login now.");
        setUsername("");
        setPassword("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.msg || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Choose a Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Choose a Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
