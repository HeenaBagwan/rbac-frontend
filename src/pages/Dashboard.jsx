import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLock, FiCheckCircle } from "react-icons/fi";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { TopBar } from "../components/TopBar";
import { canAccess } from "../utils/permissions";

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.user);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalRoles: 0, activeUsers: 0 });

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      setLoading(true);
      try {
        if (canAccess(currentUser, "view_users")) {
          const res = await api.get("/users");
          setUsers(res.data);
          setStats(s => ({ ...s, totalUsers: res.data.length, activeUsers: res.data.length }));
        }
        if (canAccess(currentUser, "view_roles")) {
          const res2 = await api.get("/roles");
          setRoles(res2.data);
          setStats(s => ({ ...s, totalRoles: res2.data.length }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Arial, sans-serif" }}>
      <Navbar title="Dashboard" onBack={() => navigate("/dashboard")} />

      <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 16px" }}>
        <TopBar title="Dashboard Overview" subtitle={`Welcome back, ${currentUser.name}!`} />

        <div style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginTop: 10
        }}>
          {canAccess(currentUser, "view_users") && (
            <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <FiUsers size={32} color="#6366f1" />
              <div style={{ marginTop: 10, fontWeight: 800, fontSize: 22 }}>{stats.totalUsers}</div>
              <div style={{ color: "#6b7280" }}>Total users</div>
            </div>
          )}

          {canAccess(currentUser, "view_roles") && (
            <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <FiLock size={32} color="#2563eb" />
              <div style={{ marginTop: 10, fontWeight: 800, fontSize: 22 }}>{stats.totalRoles}</div>
              <div style={{ color: "#6b7280" }}>Total roles</div>
            </div>
          )}

          <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
            <FiCheckCircle size={32} color="#22c55e" />
            <div style={{ marginTop: 10, fontWeight: 800, fontSize: 22 }}>{stats.activeUsers}</div>
            <div style={{ color: "#6b7280" }}>Active sessions</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <h3 style={{ marginBottom: 10 }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {canAccess(currentUser, "view_users") && (
              <button onClick={() => navigate("/users")} style={{
                padding: "12px 18px", borderRadius: 12, border: "1px solid #e6e8eb", background: "#fff", cursor: "pointer",
                fontWeight: 700, display: "flex", alignItems: "center", gap: 6
              }}>
                <FiUsers size={18} /> Manage Users
              </button>
            )}
            {canAccess(currentUser, "view_roles") && (
              <button onClick={() => navigate("/roles")} style={{
                padding: "12px 18px", borderRadius: 12, border: "1px solid #e6e8eb", background: "#fff", cursor: "pointer",
                fontWeight: 700, display: "flex", alignItems: "center", gap: 6
              }}>
                <FiLock size={18} /> Manage Roles
              </button>
            )}
          </div>
        </div>

        {canAccess(currentUser, "view_users") && (
          <div style={{ marginTop: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>System Users ({users.length})</h3>
              <button onClick={() => navigate("/users")} style={{
                background: "transparent", color: "#6366f1", border: "none", cursor: "pointer", fontWeight: 700
              }}>View all →</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12, marginTop: 12 }}>
              {loading ? <div>Loading users...</div> : users.slice(0, 6).map(u => (
                <div key={u._id} style={{ background: "#fff", padding: 14, borderRadius: 10, boxShadow: "0 6px 18px rgba(2,6,23,0.03)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 46, background: "#6366f1", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800
                    }}>{u.name?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{u.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, color: "#6b7280" }}>{u.role?.name || "No Role"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
