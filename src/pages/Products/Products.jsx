import React, { useCallback, useContext, useEffect, useState } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Offers from "../../components/Offers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import "./Products.scss";
import { ChevronDown } from "react-feather";
import { Context } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { p } from "framer-motion/client";
import Footer from "../../components/Footer";
import Price from "../../components/Price";

const Products = () => {
  const {
    products,
    setViewingProduct,
    query,
    filteredProducts,
    setFilteredProducts,
    fetchProducts,
  } = useContext(Context);

  const Navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    if (query.trim().length > 1) {
      const filtered = products.filter((product) =>
        Object.values(product).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase().trim())
        )
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [query, products]);

  return (
    <div className="ProductsPage">
      <TopBar />
      <Navbar />
      <Offers />
      <main>
        <header>
          <div className="title">All Products ({filteredProducts.length})</div>
          <div className="sortBy">
            Sort By <ChevronDown />
          </div>
        </header>
        <div className="products">
          {filteredProducts.map((product) => (
            <div
              className="product"
              key={product.id}
              onClick={() => {
                setViewingProduct(product);
                Navigate(`/viewproduct/${product.id}`);
              }}
            >
              <LazyLoadImage
                src={product.images[0]}
                alt={product.name}
                className="product-image"
                effect="blur"
              />
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-description">
                  {product.category && `${product.category}`}
                </p>
                <p className="mrp">
                  <Price product={product} />
                </p>
                {product.discount > 0 && (
                  <div className="discount">
                    <div className="discount-value">{product.discount}%</div>{" "}
                    <p>off</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
