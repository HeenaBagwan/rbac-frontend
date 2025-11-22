import React from "react";

export const TopBar = ({ title, subtitle }) => (
  <div style={{ padding: "20px 0" }}>
    <h1 style={{ margin: 0 }}>{title}</h1>
    <p style={{ margin: "6px 0 0", color: "#6b7280" }}>{subtitle}</p>
  </div>
);
