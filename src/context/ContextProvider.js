import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { db, auth } from "../db/firebase";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [homeView, setHomeView] = useState("LandingPage");
  const [viewingProduct, setViewingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState(null);
  const [pathAfterLogin, setPathAfterLogin] = useState("/");
  const [admin, setAdmin] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [writingToolsMode, setWritingToolsMode] = useState(false);
  const [adminView, setAdminView] = useState("ManageBooks");

  const fetchCart = useCallback(async (userId) => {
    if (!userId) {
      console.log("User ID is required to fetch the cart.");
      return [];
    }

    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        return userData.cart || [];
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching cart: ", error);
      return [];
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
        const userCart = await fetchCart(user.uid);
        setCart(userCart);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, [fetchCart]);

  return (
    <Context.Provider
      value={{
        currentUser,
        setCurrentUser,
        homeView,
        setHomeView,
        viewingProduct,
        setViewingProduct,
        cart,
        setCart,
        pathAfterLogin,
        setPathAfterLogin,
        fetchCart,
        fetchProducts,
        filteredProducts,
        setFilteredProducts,
        admin,
        setAdmin,
        products,
        setProducts,
        userData,
        setUserData,
        query,
        setQuery,
        writingToolsMode,
        setWritingToolsMode,
        adminView,
        setAdminView,
      }}
    >
      {children}
    </Context.Provider>
  );
};
