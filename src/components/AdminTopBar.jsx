import React, { useContext } from "react";
import woodlandLogo from "../assets/headerlogo.png";
import { Link } from "react-router-dom";
import { Context } from "../context/ContextProvider";

const AdminTopBar = () => {
  const { currentUser } = useContext(Context);

  return (
    <div className="top-bar">
      {/* <img src={woodlandLogo} alt="" id="top-bar--logo" /> */}
      <div className="options">
        <div className="option help">Help</div>
        {currentUser ? <div className="option profile">Admin Portal</div> : ""}
      </div>
    </div>
  );
};

export default AdminTopBar;
