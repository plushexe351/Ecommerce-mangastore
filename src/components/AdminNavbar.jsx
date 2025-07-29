import React from "react";
import { Heart, Search, ShoppingCart } from "react-feather";
import woodlandLogo from "../assets/headerlogo.png";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const Navigate = useNavigate();
  const Categories = [
    {
      name: "Manage Books",
      path: "/admin/manageBooks",
    },
    {
      name: "Manage Orders",
      path: "/admin/manageOrders",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
    },
  ];
  return (
    <div className="nav-bar">
      <div className="logo-container" onClick={() => Navigate("/")}>
        <img src={woodlandLogo} alt="" id="nav-bar--logo" />
      </div>
      <div className="categories-container">
        {Categories.map((cat, index) => (
          <div className="category" onClick={() => Navigate(cat.path)}>
            {cat.name}
          </div>
        ))}
      </div>
      {/* <div className="other">
        <div className="search-container">
          <Search id="logo--search" className="icon" />
          <input type="text" name="" id="global-search" placeholder="Search" />
        </div>
      </div> */}
    </div>
  );
};

export default AdminNavbar;
