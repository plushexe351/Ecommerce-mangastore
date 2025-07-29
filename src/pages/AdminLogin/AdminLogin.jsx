import React, { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  db,
  doc,
  setDoc,
} from "../../db/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
import woodlandLogo from "../../assets/headerlogo.png";
import googleLogo from "../../assets/google-logo.png";
import { toast } from "react-toastify";
import "./AdminLogin.scss";
import { useContext } from "react";
import { Context } from "../../context/ContextProvider";
import Footer from "../../components/Footer";

const AdminLogin = () => {
  const { setAdmin } = useContext(Context);
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    console.log("admin username", process.env.REACT_APP_ADMIN_USERNAME);
    if (
      username === process.env.REACT_APP_ADMIN_USERNAME &&
      password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      setAdmin(username + password);
      Navigate("/admin");
      toast.success("Hello, Admin");
    } else {
      toast.error("Login Failed, Invalid credentials");
    }
  };

  return (
    <div className="AdminLogin">
      <div className="container">
        <div className="logos">
          <img
            src={woodlandLogo}
            alt="Nike Logo"
            onClick={() => Navigate("/")}
          />
        </div>
        <header>
          <p className="heading">Admin Panel</p>
        </header>
        <main>
          <div className="sign-in-form">
            <input
              type="text"
              name="username"
              placeholder="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="username"
              placeholder="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="sign-in" onClick={handleSignIn}>
              Sign In
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;
