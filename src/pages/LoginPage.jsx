import React, { useState } from "react";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token in localStorage for future API requests
      localStorage.setItem("token", res.data.token);

      // Save user in Redux store
      dispatch(setAuth(res.data));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check API URL, CORS, and backend connectivity."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg,#0f172a 0%,#0b1220 100%)",
      padding: 20
    }}>
      <form onSubmit={submit} style={{
        width: 460,
        background: "#fff",
        padding: 28,
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(2,6,23,0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>🔐</div>
          <div>
            <h2 style={{ margin: 0 }}>Welcome Back</h2>
            <div style={{ color: "#6b7280", fontSize: 13 }}>Sign in to access your account</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e6e8eb" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e6e8eb" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 16,
            borderRadius: 10,
            border: "none",
            background: loading ? "#94a3b8" : "#6366f1",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ marginTop: 12, color: "#6b7280", fontSize: 13 }}>
          Test: admin@test.com / password123
        </div>
      </form>
    </div>
  );
}
