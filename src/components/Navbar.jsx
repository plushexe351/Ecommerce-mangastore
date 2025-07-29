import React, { useContext, useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingCart } from "react-feather";
import woodlandLogo from "../assets/headerlogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../db/firebase";
import Sparkles from "../assets/sparkles.png";

const Navbar = () => {
  const {
    cart,
    query,
    setQuery,
    currentUser,
    writingToolsMode,
    setWritingToolsMode,
  } = useContext(Context);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const Navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const handleSearchClick = () => {
    if (location.pathname !== "/products") {
      Navigate("/products");
    }
  };
  const logSearchQuery = async (searchText) => {
    if (!searchText.trim() || !currentUser) return; // Ignore empty searches & unauthenticated users

    try {
      const userDocRef = doc(db, "users", currentUser.uid); // Reference user document

      await updateDoc(userDocRef, {
        searchQueries: arrayUnion(searchText), // Append new search query
      });
    } catch (error) {
      console.error("Error logging search query:", error);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => logSearchQuery(e.target.value), 1000));
  };

  useEffect(() => {
    if (location.pathname === "/products") {
      searchInputRef.current?.focus();
    }
  }, [location.pathname]);

  return (
    <div className="nav-bar">
      <div className="logo-container" onClick={() => Navigate("/")}>
        <img src={woodlandLogo} alt="" id="nav-bar--logo" />
      </div>
      <div className="categories-container">
        <div className="category">
          <p className="" onClick={() => Navigate("/Home")}>
            Home
          </p>
        </div>
        <div className="category" onClick={() => Navigate("/categories")}>
          <p>Categories</p>
        </div>

        {/* <div className="category">About Us</div> */}
        <div className="category" onClick={() => Navigate("/contact")}>
          Contact
        </div>
        {/* <div className="category">Shippings & Returns</div> */}
        {/* <div className="category">FAQs</div> */}
      </div>
      <div className="other">
        <div className="search-container" onClick={handleSearchClick}>
          <Search id="logo--search" className="icon" />
          <input
            type="text"
            id="global-search"
            placeholder="Search"
            value={query}
            onChange={handleSearchChange}
            ref={searchInputRef}
          />
        </div>
        <Heart
          id="logo--favorites"
          className="icon"
          onClick={() => Navigate("/favorites")}
        />
        <div className="cart">
          <ShoppingCart
            id="logo--shopping-cart"
            className="icon"
            onClick={() => Navigate("/cart")}
          />
          {cart.length > 0 && <div className="cart-qty">{cart.length}</div>}
        </div>
        <div
          className="ai-toggle"
          onClick={() =>
            setWritingToolsMode((writingToolsMode) => !writingToolsMode)
          }
        >
          <img src={Sparkles} alt="" height="30" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
