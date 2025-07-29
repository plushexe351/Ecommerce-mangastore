import React, { useContext, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminTopBar from "../../components/AdminTopBar";
import "./AdminPanel.scss";
import { Context } from "../../context/ContextProvider";

import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const AdminPanel = () => {
  const { admin } = useContext(Context);
  const Navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      Navigate("/adminlogin");
    }
  }, [admin, Navigate]);
  return (
    <div className="AdminPanel">
      <AdminTopBar />
      <AdminNavbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AdminPanel;
