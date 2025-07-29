import React from "react";
import footerLogo from "../assets/headerlogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer">
      <header>
        <p>
          <Link
            to="/products"
            style={{ textDecoration: "none", color: "white" }}
          >
            Explore
          </Link>
        </p>
      </header>
      <div class="footer-content">
        <img src={footerLogo} alt="" />
        <p>© Mangastore, Inc. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
