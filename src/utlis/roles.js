const STAFF_ROLES = ["ADMIN", "MANAGER", "EDITOR"];

const canWriteProducts = (role) => STAFF_ROLES.includes(role);
const canDeleteProducts = (role) => role === "ADMIN" || role === "MANAGER";
const canManageOrders = (role) => role === "ADMIN" || role === "MANAGER";
const canViewDeletions = canManageOrders;
const canViewEarnings = (role) => role === "ADMIN";
const canManageTeam = (role) => role === "ADMIN";

const ROLE_LABEL = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EDITOR: "Editor",
  USER: "Customer",
};

export {
  STAFF_ROLES,
  canWriteProducts,
  canDeleteProducts,
  canManageOrders,
  canViewDeletions,
  canViewEarnings,
  canManageTeam,
  ROLE_LABEL,
};
