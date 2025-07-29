import React, { useContext, useEffect } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Offers from "../../components/Offers";
import "./Categories.scss";
import { ChevronDown } from "react-feather";
import { Context } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Footer from "../../components/Footer";

const cats = [
  // { name: "Shonen", img: "/images/shonen.jpg" },
  // { name: "Seinen", img: "/images/seinen.jpg" },
  // { name: "Isekai", img: "/images/isekai.jpg" },
  { name: "Sports", img: "/images/sports.jpg" },
  { name: "Fantasy", img: "/images/fantasy.jpg" },
  { name: "Horror", img: "/images/horror.jpg" },
  { name: "Sci-Fi", img: "/images/scifi.jpg" },
];

const Categories = () => {
  const { setQuery } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="CategoriesPage">
      <TopBar />
      <Navbar />
      <Offers />
      <main>
        <header>
          <div className="title">Categories ({cats.length})</div>
        </header>
        <div className="categories">
          {cats.map((cat, index) => (
            <div
              className="cat"
              key={index}
              onClick={() => {
                setQuery(cat.name);
                navigate("/products");
              }}
            >
              <LazyLoadImage
                src={cat.img}
                alt={cat.name}
                effect="blur"
                className="lazy-image"
              />
              <div className="product-details">
                <p className="product-name">{cat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
