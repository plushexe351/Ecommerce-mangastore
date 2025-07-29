import React, { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import heroImg from "../assets/hero-img.png";
import trending1 from "../assets/trending1.png";
import trending2 from "../assets/trending2.png";
import trending3 from "../assets/trending3.png";
import trending4 from "../assets/trending4.png";
import trending5 from "../assets/trending5.png";
import vid from "../assets/hero-video.mov";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/firebase";
import { Context } from "../context/ContextProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LandingPage = () => {
  const Navigate = useNavigate();
  const [recommendedProducts, setRecommendedProducts] = useState([]); // Recommended products based on search history
  const [searchHistory, setSearchHistory] = useState([]); // User's search history
  const { currentUser, products, setViewingProduct, fetchProducts, setQuery } =
    useContext(Context);
  const recommendedScrollRef = useRef(null);
  const trendingScollRef = useRef(null);
  const goToProductsPage = () => {
    setQuery("");
    Navigate("/products");
  };
  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -450, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 450, behavior: "smooth" });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    if (!currentUser) return;

    const fetchSearchHistory = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const queries = userData.searchQueries
            ? userData.searchQueries
                .slice(-10)
                .map((query) => query.toLowerCase()) // Get last 5 searches
            : [];

          setSearchHistory(queries);
        }
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    fetchSearchHistory();
  }, [currentUser]);

  useEffect(() => {
    if (!searchHistory.length || !products.length) return;

    const filteredProducts = products.filter((product) =>
      searchHistory.some((query) => {
        const lowerCaseQuery = query.toLowerCase();

        return Object.values(product).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        );
      })
    );

    setRecommendedProducts(filteredProducts);
  }, [searchHistory, products]);

  const latestProducts = products.slice(0, 6);
  const featuredProducts = products.filter((product) =>
    product.tags?.toLowerCase().includes("featured".toLowerCase())
  );
  const trendingProducts = products.filter((product) =>
    product.tags?.toLowerCase().includes("trending".toLowerCase())
  );

  return (
    <main id="landingPage">
      <section id="home">
        <div className="hero-img">
          <video src={vid} autoPlay loop onClick={goToProductsPage}></video>
          <figcaption>
            <h1 id="hero-img--title">SHOP ON OUR NEW MARKDOWNS !</h1>
            <p id="hero-img--description">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Cupiditate mollitia debitis aspernatur deleniti dolorum ex
              doloribus quasi! Quibusdam, cupiditate obcaecati?
            </p>
            <button id="btn--shop" onClick={goToProductsPage}>
              Shop
            </button>
          </figcaption>
        </div>
      </section>

      {/* For you */}

      {recommendedProducts.length > 0 && (
        <section id="trending">
          <header>
            <div className="section-title">For You</div>
            <div className="pagination">
              <div className="pagination-title">Shop</div>
              <div
                className="navigate left"
                onClick={() => scrollLeft(recommendedScrollRef)}
              >
                <ChevronLeft />
              </div>
              <div
                className="navigate right"
                onClick={() => scrollRight(recommendedScrollRef)}
              >
                <ChevronRight />
              </div>
            </div>
          </header>
          <div
            className="trending-products-container"
            ref={recommendedScrollRef}
          >
            {recommendedProducts.map((product) => (
              <div
                className="trending"
                key={product.id}
                onClick={() => {
                  setViewingProduct(product);
                  Navigate(`/viewproduct/${product.id}`);
                }}
              >
                <LazyLoadImage
                  src={product.images[0]}
                  alt=""
                  effect="blur"
                  className="lazy-image"
                />
                <figcaption>
                  <a href="/" className="link">
                    Shop
                  </a>
                </figcaption>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}

      {featuredProducts.length > 0 && (
        <section id="trending">
          <header>
            <div className="section-title">Featured</div>
            <div className="pagination">
              <div className="pagination-title">Shop</div>
              <div
                className="navigate left"
                onClick={() => scrollLeft(trendingScollRef)}
              >
                <ChevronLeft />
              </div>
              <div
                className="navigate right"
                onClick={() => scrollRight(trendingScollRef)}
              >
                <ChevronRight />
              </div>
            </div>
          </header>
          <div className="trending-products-container" ref={trendingScollRef}>
            {featuredProducts.map((product) => (
              <div
                className="trending"
                key={product.id}
                onClick={() => {
                  setViewingProduct(product);
                  Navigate(`/viewproduct/${product.id}`);
                }}
              >
                <LazyLoadImage
                  src={product.images[0]}
                  alt=""
                  effect="blur"
                  className="lazy-image"
                />
                <figcaption>
                  <a href="/" className="link">
                    Shop
                  </a>
                </figcaption>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest */}

      {trendingProducts.length > 0 && (
        <section id="latest">
          <div className="section-title">Trending</div>
          <div className="latest-products-container">
            {trendingProducts.map((product) => (
              <div
                className="latest"
                key={product.id}
                onClick={() => {
                  setViewingProduct(product);
                  Navigate(`/viewproduct/${product.id}`);
                }}
              >
                <LazyLoadImage
                  src={product.images[0]}
                  alt=""
                  effect="blur"
                  className="lazy-image"
                />
                <figcaption>
                  <a href="/" className="link">
                    Shop
                  </a>
                </figcaption>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="hero-img">
          <img
            src={heroImg}
            onClick={goToProductsPage}
            alt="Lifestyle Running Shoes"
            style={{ marginTop: "1rem" }}
          ></img>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
