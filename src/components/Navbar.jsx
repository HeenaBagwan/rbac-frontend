import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title, onBack }) {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1); // SPA back
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // SPA-friendly redirect
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#0f172a",
        color: "#fff",
        boxShadow: "0 6px 18px rgba(2,6,23,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={handleBack} style={{ cursor: "pointer", fontSize: 20 }}>
          ←
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: "#cbd5e1" }}>
            {user?.role?.name || user?.role}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
