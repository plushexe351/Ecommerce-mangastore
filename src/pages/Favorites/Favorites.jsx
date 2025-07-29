import React, { useContext, useEffect, useState } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Offers from "../../components/Offers";
import "./Favorites.scss";
import { ChevronDown } from "react-feather";
import { Context } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { db, doc, getDoc } from "../../db/firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Footer from "../../components/Footer";

const Favorites = () => {
  const Navigate = useNavigate();
  const { products, setViewingProduct, currentUser, setPathAfterLogin } =
    useContext(Context);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setPathAfterLogin("/favorites");
      Navigate("/login");
    }
  }, [currentUser, Navigate, setPathAfterLogin]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const favoriteProducts = userData
    ? products.filter((product) => userData.favorites?.includes(product.id))
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="FavoritesPage">
      <TopBar />
      <Navbar />
      <Offers />
      <main>
        <header>
          <div className="title">
            Favorite Products ({favoriteProducts.length})
          </div>
          <div className="sortBy">
            Sort By <ChevronDown />
          </div>
        </header>
        <div className="products">
          {favoriteProducts.map((product, index) => (
            <div
              className="product"
              key={index}
              onClick={() => {
                setViewingProduct(product);
                navigate(`/viewproduct/${product.id}`);
              }}
            >
              <LazyLoadImage
                src={product.images[0]}
                alt=""
                effect="blur"
                className="product-image"
              />
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-description">{product.category}</p>
                <p className="mrp">MRP : ₹{parseFloat(product.MRP)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
