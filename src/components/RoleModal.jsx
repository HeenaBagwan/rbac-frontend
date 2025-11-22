import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function RoleModal({ open, onClose, onSave }) {
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    api.get("/permissions")
      .then(res => setPermissions(res.data))
      .catch(() => {
        setPermissions([
          { _id: "p_view_users", name: "view_users", label: "View Users" },
          { _id: "p_create_user", name: "create_user", label: "Create Users" },
          { _id: "p_update_role", name: "update_role", label: "Update Roles" }
        ]);
      });

    setSelected([]);
    setName("");
    setDesc("");
  }, [open]);

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSave = async () => {
    if (!name.trim()) return alert("Enter role name");
    if (selected.length === 0) return alert("Select at least one permission");

    setLoading(true);
    try {
      const res = await api.post("/roles", {
        name,
        description: desc,
        permissions: selected
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div onClick={onClose} style={modalBackdropStyle}>
      <div onClick={e => e.stopPropagation()} style={modalContentStyle}>
        <h3>Add New Role</h3>
        <p style={{ color: "#6b7280", marginBottom: 12 }}>Choose permissions for this role</p>

        <input
          placeholder="Role name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={inputStyle}
        />

        <div style={{ marginTop: 16 }}>
          <h4>Permissions</h4>
          <div style={permissionsGridStyle}>
            {permissions.map(p => (
              <label key={p._id} style={permissionLabelStyle(selected.includes(p._id))}>
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
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={saveButtonStyle}>
            {loading ? "Saving..." : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Styles -----
const modalBackdropStyle = {
  position: "fixed", inset: 0, backgroundColor: "rgba(2,6,23,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200
};

const modalContentStyle = {
  width: "min(92%, 500px)", background: "#fff", borderRadius: 12, padding: 20,
  maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(2,6,23,0.4)"
};

const inputStyle = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e6e8eb", marginBottom: 12 };

const permissionsGridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };

const permissionLabelStyle = (selected) => ({
  display: "flex", gap: 10, alignItems: "center", padding: 10,
  borderRadius: 8, border: "1px solid #eef2f7",
  background: selected ? "#eef2ff" : "#fff", cursor: "pointer"
});

const cancelButtonStyle = { padding: "8px 12px", borderRadius: 8, border: "1px solid #e6e8eb" };
const saveButtonStyle = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" };
