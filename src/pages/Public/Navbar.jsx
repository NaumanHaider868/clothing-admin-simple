import React, { useEffect, useState } from "react";
import "../../assets/css/style.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { canWriteProducts, ROLE_LABEL } from "../../utlis/roles";
import { api } from "../../utlis/customAPI";
import { seasonLabel, seasonsFromProducts } from "../../utlis/seasons";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSeason = (searchParams.get("season") || "").toLowerCase();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/product/all");
      return response.data;
    },
  });

  const seasons = seasonsFromProducts(Array.isArray(data?.data) ? data.data : []);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/product_action");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar pr-[52px] relative`}>
      <div className="fixed w-full right-0 top-0">
        <div
          className={`flex justify-between items-center py-3 z-50 transition-all duration-300 pr-[52px] pl-[52px] font-[monospace] ${
            isScrolled
              ? "backdrop-blur-md bg-[#2b2b2b]/60 shadow-md"
              : "bg-transparent"
          }`}
        >
          <div className="option-l flex justify-between items-center">
            <ul
              className={`web-option flex gap-5 ${
                isScrolled ? "text-white" : ""
              }`}
            >
              <li className={`text-[1rem] ${activeSeason ? "" : "active"}`}>
                <Link to="/">All</Link>
              </li>
              {seasons.map((season) => (
                <li
                  key={season}
                  className={`text-[1rem] ${activeSeason === season ? "active" : ""}`}
                >
                  <Link to={`/?season=${encodeURIComponent(season)}`}>{seasonLabel(season)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="logo">
            <span></span>
          </div>

          <div className="option-r flex justify-between items-center">
            <ul className="user-option flex gap-4">
              {canWriteProducts(user?.role) ? (
                <li
                  className="w-[50px] h-[50px] rounded-full bg-[#D1D5DB] text-black flex justify-center items-center cursor-pointer"
                  onClick={handleNavigate}
                >
                  <FaPlus className="w-[20px] h-[20px]" />
                </li>
              ) : null}
              <li className="font-[monospace] text-sm flex items-center gap-3">
                <span>
                  {user?.firstName || user?.email} · {ROLE_LABEL[user?.role] || user?.role}
                </span>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
