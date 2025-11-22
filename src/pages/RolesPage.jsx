import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import api from "../api/api";
import RoleModal from "../components/RoleModal";
import EditRoleModal from "../components/EditRoleModal";
import Navbar from "../components/Navbar";
import { canAccess } from "../utils/permissions";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editRole, setEditRole] = useState(null);

  // Get current logged-in user
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch roles");
    }
  };

  const handleAdd = (newRole) =>
    setRoles((prev) => [...prev, newRole]);

  const handleEdit = (updatedRole) =>
    setRoles((prev) =>
      prev.map((r) => (r._id === updatedRole._id ? updatedRole : r))
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      setRoles((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete role");
    }
  };

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar title="Roles Management" onBack={() => (window.location = "/dashboard")} />

      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>
            Roles Management
          </h2>

          {/* Add Role Button (permission-based) */}
          {canAccess(user, "create_role") && (
            <button
              onClick={() => setOpenAdd(true)}
              style={{
                padding: "12px 20px",
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              Add Role
            </button>
          )}
        </div>

        {/* Roles Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {roles.map((role) => (
            <div
              key={role._id}
              style={{
                padding: 20,
                borderRadius: 12,
                border: "1px solid #e6e8eb",
                boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#fff",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)";
              }}
            >
              {/* Edit/Delete icons (permission-based) */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "flex",
                  gap: 8,
                }}
              >
                {canAccess(user, "update_role") && (
                  <FiEdit
                    onClick={() => setEditRole(role)}
                    style={{ cursor: "pointer", color: "#2563eb" }}
                    size={18}
                    title="Edit Role"
                  />
                )}
                {canAccess(user, "delete_role") && (
                  <FiTrash2
                    onClick={() => handleDelete(role._id)}
                    style={{ cursor: "pointer", color: "#ef4444" }}
                    size={18}
                    title="Delete Role"
                  />
                )}
              </div>

              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#111827",
                  }}
                >
                  {role.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    margin: "6px 0",
                  }}
                >
                  {role.description || "No description"}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 8,
                  }}
                >
                  {role.permissions?.map((p) => (
                    <span
                      key={p._id}
                      style={{
                        fontSize: 12,
                        background: "#eef2ff",
                        color: "#2563eb",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Role Modal */}
        {canAccess(user, "create_role") && (
          <RoleModal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            onSave={async (newRole) => {
              try {
                const res = await api.get(`/roles/${newRole._id}`);
                handleAdd(res.data);
              } catch {
                handleAdd(newRole);
              }
              setOpenAdd(false);
            }}
          />
        )}

        {/* Edit Role Modal */}
        {editRole && canAccess(user, "update_role") && (
          <EditRoleModal
            open={!!editRole}
            role={editRole}
            onClose={() => setEditRole(null)}
            onSave={(updatedRole) => {
              handleEdit(updatedRole);
              setEditRole(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
