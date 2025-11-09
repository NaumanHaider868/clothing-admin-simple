import React, { useEffect, useState } from "react";
import "../../assets/css/style.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

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
              <li className="text-[1rem]">
                <Link to="/">All Products</Link>
              </li>
              {/* <li className="text-[1rem]">
                <Link to="/">Men</Link>
              </li>
              <li className="text-[1rem]">
                <Link to="/">Woman</Link>
              </li>
              <li className="text-[1rem]">
                <Link to="/">Boys</Link>
              </li>
              <li className="text-[1rem]">
                <Link to="/">Girls</Link>
              </li> */}

              <li className="has-dropdown relative">
                <span className="text-[1rem]">Collections</span>
                <div className="dropdown absolute bg-white text-black p-3 rounded shadow hidden group-hover:block">
                  <div className="dropdown-col">
                    <span className="title font-semibold">Seasons</span>
                    <ul>
                      <li>Winter</li>
                      <li>Summer</li>
                      <li>Monsoon</li>
                      <li>All Seasons</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="logo">
            <span></span>
          </div>

          <div className="option-r flex justify-between items-center">
            <ul className="user-option flex gap-4">
              <li
                className="w-[50px] h-[50px] rounded-full bg-[#D1D5DB] text-black flex justify-center items-center cursor-pointer"
                onClick={handleNavigate}
              >
                <FaPlus className="w-[20px] h-[20px]" />
              </li>
              <li className="user">
                <span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
