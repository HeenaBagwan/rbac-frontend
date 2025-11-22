import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function EditRoleModal({ open, onClose, onSave, role }) {
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    api.get("/permissions")
      .then(r => setPermissions(r.data))
      .catch(() => {
        setPermissions([
          { _id: "p_view_users", name: "view_users", label: "View Users" },
          { _id: "p_create_user", name: "create_user", label: "Create Users" },
          { _id: "p_update_role", name: "update_role", label: "Update Roles" }
        ]);
      });

    if (role) {
      setName(role.name);
      setDesc(role.description || "");
      setSelected(role.permissions?.map(p => p._id) || []);
    } else {
      setName("");
      setDesc("");
      setSelected([]);
    }
  }, [open, role]);

  const toggle = (id) =>
    setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const handleSave = async () => {
    if (!name.trim() || selected.length === 0) {
      return alert("Please enter role name and select at least one permission");
    }
    setLoading(true);
    try {
      const res = await api.put(`/roles/${role._id}`, {
        name,
        description: desc,
        permissions: selected
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(2,6,23,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "min(92%, 920px)", background: "#fff", borderRadius: 12, overflow: "auto",
        maxHeight: "88vh", padding: 20, boxShadow: "0 20px 60px rgba(2,6,23,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>Edit Role</h3>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Update permissions for this role</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Role name"
            style={{ padding: 12, borderRadius: 8, border: "1px solid #e6e8eb" }} />
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description"
            style={{ padding: 12, borderRadius: 8, border: "1px solid #e6e8eb" }} />
        </div>

        <div style={{ marginTop: 18 }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Permissions</h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 10
          }}>
            {permissions.map(p => (
              <label key={p._id} style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #eef2f7",
                background: selected.includes(p._id) ? "#eef2ff" : "#fff",
                cursor: "pointer"
              }}>
                <input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggle(p._id)} />
                <div>
                  <div style={{ fontWeight: 700 }}>{p.label || p.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{p.name}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e6e8eb" }}>Cancel</button>
          <button onClick={handleSave} disabled={loading}
            style={{ padding: "8px 12px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none" }}>
            {loading ? "Saving..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
