import React from "react";
import "../../assets/css/style.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

export default function Navbar() {
  const navigate = useNavigate();
  const handleNavigate = (e)=>{
    e.preventDefault();
    navigate("/product_action")

  }
  return (
    <div className="navbar pr-[52px]">
      <div className="flex justify-between items-center">
        <div className="option-l flex justify-between items-center">
          <ul className="web-option">
            <li>
              <Link to="/">All Products</Link>
            </li>

            <li className="has-dropdown">
              <span>Collections</span>
              <div className="dropdown">
                <div className="dropdown-col">
                  <span className="title">Seasons</span>
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
          <ul className="user-option">
            <li className="w-[50px] h-[50px] rounded-full bg-[#D1D5DB] text-black flex justify-center items-center cursor-pointer" onClick={(e)=>handleNavigate(e)}>
              <FaPlus className="w-[20px] h-[20px]" />
            </li>
            <li className="user">
              <span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
