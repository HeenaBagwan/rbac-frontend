import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import UserModal from "../components/UserModal";
import { useSelector } from "react-redux";
import { canAccess } from "../utils/permissions";

export default function UsersPage() {
  const user = useSelector(s => s.auth.user);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        if (canAccess(user, "view_users")) {
          const u = await api.get("/users");
          setUsers(u.data);
        }
        if (canAccess(user, "view_roles")) {
          const r = await api.get("/roles");
          setRoles(r.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const changeRole = async (userId, roleId) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { roleId });
      // update store and UI
      setUsers(prev => prev.map(x => x._id === userId ? res.data : x));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const removeUser = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(x => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar title="Users Management" onBack={() => window.location = "/dashboard"} />
      <div style={{ maxWidth: 1100, margin: "20px auto", padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Users</h2>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Manage users and assign roles ({users.length})</p>
          </div>
          {canAccess(user, "create_user") && (
            <button onClick={() => setOpen(true)} style={{ background: "#10b981", color: "#fff", padding: "10px 14px", borderRadius: 10, border: "none" }}>+ Add User</button>
          )}
        </div>

        {loading ? <div>Loading...</div> : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12
          }}>
            {users.map(u => (
              <div key={u._id} style={{ background: "#fff", padding: 14, borderRadius: 12, position: "relative", boxShadow: "0 10px 30px rgba(2,6,23,0.03)" }}>
                {canAccess(user, "delete_user") && (
                  <button onClick={() => removeUser(u._id)} style={{
                    position: "absolute", top: 12, right: 12, background: "#fff5f5", border: "1px solid #fecaca", padding: 8, borderRadius: 8, cursor: "pointer"
                  }}>🗑️</button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 24, background: "#7c3aed", color: "#fff", display: "flex",
                    alignItems: "center", justifyContent: "center", fontWeight: 800
                  }}>{u.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{u.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{u.email}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  {canAccess(user, "update_user_role") ? (
                    <select value={u.role?._id || ""} onChange={(e) => changeRole(u._id, e.target.value)}
                      style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e8eb", width: "100%" }}>
                      <option value="">Select Role</option>
                      {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                  ) : (
                    <div style={{ display: "inline-block", background: "#eef2ff", padding: "6px 10px", borderRadius: 8 }}>{u.role?.name || "No Role"}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <UserModal open={open} onClose={() => setOpen(false)} onSave={(nu) => setUsers(prev => [nu, ...prev])} />
    </div>
  );
}
