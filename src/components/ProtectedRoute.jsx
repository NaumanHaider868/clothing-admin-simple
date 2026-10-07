import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { STAFF_ROLES } from "../utlis/roles";

export function ProtectedRoute() {
  const { user, ready, logout } = useAuth();

  if (!ready) {
    return <div className="p-10 font-[monospace]">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!STAFF_ROLES.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center font-[monospace] space-y-4">
        <p>This portal is for the store team. Customer accounts shop on the store site.</p>
        <button type="button" onClick={logout} className="px-4 py-2 bg-black text-white rounded">
          Log out
        </button>
      </div>
    );
  }

  return <Outlet />;
}
