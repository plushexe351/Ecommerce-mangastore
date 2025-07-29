import React, { Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import { useContext } from "react";
import { Context } from "./context/ContextProvider";
import { toastOptions } from "./Toast/toastConfig";
import "./Toast/toast.scss";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";
import CheckOut from "./pages/Checkout/CheckOut";
import ViewingProduct from "./pages/ViewingProduct.jsx/ViewingProduct";
import AdminPanel from "./pages/Admin/AdminPanel";
import Orders from "./pages/Orders/Orders";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Favorites from "./pages/Favorites/Favorites";
import Categories from "./pages/Categories/Categories";
import ContactForm from "./pages/Contact/ContactForm";
import WritingTools from "./components/WritingTools";
import ManageBooks from "./pages/Admin/ManageBooks";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import ManageOrders from "./pages/Admin/ManageOrders";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import ProgressBar from "./components/ProgressBar";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-overlay">
      <TopBar />
      <Navbar />
      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(Context);
  return currentUser ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]); // triggers on route change

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/*" element={<AdminPanel />}>
          <Route path="" element={<Navigate to="manageBooks" />} />
          <Route path="manageBooks" element={<ManageBooks />} />
          <Route path="manageOrders" element={<ManageOrders />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/products" element={<Products />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/viewproduct/:productId" element={<ViewingProduct />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  const { writingToolsMode } = useContext(Context);

  return (
    <Router>
      <div className="App">
        <ProgressBar />

        <AppContent />
        <ToastContainer {...toastOptions} />
        {writingToolsMode && <WritingTools />}
      </div>
    </Router>
  );
}

export default App;
