import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";
import { ArrowRight, User, LogOut } from "react-feather";
import { auth } from "../db/firebase";
import { toast } from "react-toastify";

const TopBar = () => {
  const { currentUser, setCurrentUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      window.location.reload();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="top-bar">
      <div className="options">
        {currentUser ? (
          <div className="option profile">
            <Link
              to="/orders"
              className="link"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
                gap: "0.5rem",
              }}
            >
              Konichiwa, {currentUser.displayName} <User size={15} />
            </Link>
            <div className="logout" onClick={handleLogout}>
              <LogOut size={15} /> Log out
            </div>
          </div>
        ) : (
          <>
            <div className="option sign-in">
              <Link
                to="/login"
                className="link"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "none",
                  gap: "0.5rem",
                }}
              >
                Konichiwa, Welcome to Manga Store | Sign In{" "}
                <ArrowRight style={{ height: "15px", width: "15px" }} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
