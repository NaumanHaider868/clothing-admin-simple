import { useAuth } from "../context/AuthContext";

export function RoleGate({ allow, children }) {
  const { user } = useAuth();
  if (!allow(user?.role)) {
    return (
      <div className="p-8 font-[monospace]">You do not have access to this page.</div>
    );
  }
  return children;
}
