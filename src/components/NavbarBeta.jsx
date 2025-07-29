import React, { useContext, useRef, useState } from "react";
import { Heart, Search, ShoppingCart } from "react-feather";
import woodlandLogo from "../assets/headerlogo.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/ContextProvider";
import { db, doc, collection, addDoc, serverTimestamp } from "../db/firebase"; // Import Firestore
import { useAuth } from "../context/AuthContext"; // Assuming you have AuthContext

const Navbar = () => {
  const { cart, query, setQuery } = useContext(Context);
  const { currentUser } = useAuth(); // Get current user
  const Navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Function to log search queries for each user
  const logSearchQuery = async (searchText) => {
    if (!searchText.trim() || !currentUser) return; // Ignore empty searches & unauthenticated users

    try {
      const userDoc = doc(db, "users", currentUser.uid); // Reference user document
      const searchCollection = collection(userDoc, "search-queries"); // Subcollection for searches

      await addDoc(searchCollection, {
        query: searchText,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error logging search query:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value);

    // Clear previous timeout to avoid multiple logs
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set a delay before logging the search query (e.g., 1 second)
    setTypingTimeout(setTimeout(() => logSearchQuery(e.target.value), 1000));
  };

  return (
    <div className="nav-bar">
      <div className="logo-container" onClick={() => Navigate("/")}>
        <img src={woodlandLogo} alt="Logo" id="nav-bar--logo" />
      </div>
      <div
        className="categories-container"
        onClick={() => Navigate("/products")}
      >
        <div className="category">New & Featured</div>
        <div className="category">Men</div>
        <div className="category">Women</div>
        <div className="category">Kids</div>
        <div className="category">Sale</div>
      </div>
      <div className="other">
        <div className="search-container">
          <Search id="logo--search" className="icon" />
          <input
            type="text"
            id="global-search"
            placeholder="Search"
            value={query}
            onChange={handleSearchChange} // Log searches
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
      </div>
    </div>
  );
};

export default Navbar;
