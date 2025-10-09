import React from "react";
import "../../assets/css/style.scss";
import { Link } from "react-router-dom";

export default function Navbar() {
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

            <li>
              <Link to="/products?sort=new">New</Link>
            </li>
          </ul>
        </div>
        <div className="logo">
          <span></span>
        </div>
        <div className="option-r flex justify-between items-center">
          <ul className="user-option">
            <li className="user">
              <span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
