import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Manga Haven</h2>
        <ul className="sidebar-menu">
          <li>
            <Link
              to="/dashboard"
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/homepage"
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              Homepage
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay to close the menu */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
