// src/utils/Permission.js

// user: the current logged-in user from Redux
// permission: string like "create_role", "update_user", etc.
export const canAccess = (user, permission) => {
  if (!user) return false;                 // no user -> no access
  if (!Array.isArray(user.permissions)) return false; // no permissions -> no access
  return user.permissions.includes(permission);       // true if permission exists
};
