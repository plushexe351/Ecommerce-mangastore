import React, { useContext, useEffect, useState } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import "./ViewingProduct.scss";
import { Context } from "../../context/ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import Offers from "../../components/Offers";
import { Heart } from "react-feather";
import { db, doc, getDoc, updateDoc } from "../../db/firebase";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { span } from "framer-motion/client";
import Footer from "../../components/Footer";
import Price from "../../components/Price";
const ViewingProduct = () => {
  const { productId } = useParams();
  const Navigate = useNavigate();
  const { currentUser, setCart, setPathAfterLogin, products } =
    useContext(Context);

  const [viewImg, setViewImg] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [viewingProduct, setViewingProduct] = useState(null);

  useEffect(() => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setViewingProduct(product);
      setViewImg(product.images[0]);
    } else {
      Navigate("/products");
    }
  }, [productId, products, Navigate]);

  useEffect(() => {
    if (currentUser) {
      const fetchFavoriteStatus = async () => {
        const userDoc = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDoc);
        const userData = userSnap.data();
        if (userData) {
          setIsFavorite(userData.favorites?.includes(viewingProduct?.id));
        }
      };

      fetchFavoriteStatus();
    }
  }, [currentUser, viewingProduct?.id]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      setPathAfterLogin(`/viewproduct/${viewingProduct.id}`);
      Navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    const userDoc = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();

    let updatedCart = userData.cart || [];
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.id === viewingProduct.id && item.size === selectedSize
    );

    if (existingProductIndex >= 0) {
      updatedCart[existingProductIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...viewingProduct, quantity, size: selectedSize });
    }

    await updateDoc(userDoc, { cart: updatedCart });
    setCart(updatedCart);
    toast.success("Cart Updated");
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      Navigate("/login");
      return;
    }

    const userDoc = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();

    let updatedFavorites = userData.favorites || [];

    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter(
        (id) => id !== viewingProduct.id
      );
    } else {
      updatedFavorites.push(viewingProduct.id);
    }

    await updateDoc(userDoc, { favorites: updatedFavorites });
    setIsFavorite(!isFavorite);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  if (!viewingProduct) return null;

  return (
    <div className="ViewingProduct">
      <TopBar />
      <Navbar />
      <main>
        <div className="product-view">
          <div className="select-view-img">
            {viewingProduct?.images.map((img) => (
              <img src={img} alt="" onClick={() => setViewImg(img)} key={img} />
            ))}
          </div>
          <div className="view-image">
            <LazyLoadImage src={viewImg} alt="" effect="blur" />
          </div>
          <div className="product-details-and-actions">
            <header>
              <div className="title">{viewingProduct?.name}</div>
              <div className="category">{viewingProduct?.category} comic.</div>
            </header>
            <div className="pricing">
              <p className="price">
                <Price product={viewingProduct} />
              </p>
              <p className="tax-inclusion">incl. of taxes</p>
              <div className="other">(Also includes all applicable duties)</div>
            </div>
            <div className="select-size">
              <p className="title">Select Size</p>
              <div className="sizes">
                {viewingProduct?.sizes &&
                  viewingProduct.sizes?.split(",").map((size, index) => (
                    <div
                      className={`size ${
                        selectedSize === size.trim() ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSize(size.trim())}
                      key={index}
                    >
                      {size.trim()}
                    </div>
                  ))}
              </div>
            </div>
            <div className="actions">
              <div
                className="action btn--add-to-cart"
                onClick={handleAddToCart}
              >
                Add to Cart
              </div>
              <div
                className={`action btn--favorite ${
                  isFavorite ? "selected" : ""
                }`}
                onClick={handleToggleFavorite}
              >
                Add to Wishlist{" "}
                {isFavorite ? <Heart fill="black" /> : <Heart color="white" />}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewingProduct;
