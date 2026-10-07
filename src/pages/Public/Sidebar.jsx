import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  canManageOrders,
  canManageTeam,
  canViewDeletions,
  canViewEarnings,
  canWriteProducts,
} from "../../utlis/roles";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 font-[monospace] text-sm ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`;

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const links = [
    { to: "/", label: "Products", end: true, show: true },
    { to: "/product_action", label: "Add product", show: canWriteProducts(role) },
    { to: "/import", label: "Bulk upload", show: canWriteProducts(role) },
    { to: "/orders", label: "Orders", show: canManageOrders(role) },
    { to: "/activity", label: "Deletion log", show: canViewDeletions(role) },
    { to: "/team", label: "Team", show: canManageTeam(role) },
    { to: "/dashboard", label: "Earnings", show: canViewEarnings(role) },
  ];

  return (
    <aside className="w-52 shrink-0 border-r border-gray-200 min-h-[calc(100vh-72px)] pt-16">
      <nav className="flex flex-col">
        {links
          .filter((link) => link.show)
          .map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
