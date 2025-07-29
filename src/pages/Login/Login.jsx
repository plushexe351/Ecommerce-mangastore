import React from "react";
import {
  auth,
  provider,
  signInWithPopup,
  db,
  doc,
  setDoc,
} from "../../db/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TopBar from "../../components/TopBar";
// import jordanLogo from "../../assets/jordan-logo.png";
import woodlandLogo from "../../assets/headerlogo.png";
import googleLogo from "../../assets/google-logo.png";
import { toast } from "react-toastify";
import "./Login.scss";
import { useContext } from "react";
import { Context } from "../../context/ContextProvider";
import Footer from "../../components/Footer";

const Login = () => {
  const { currentUser, setCurrentUser, pathAfterLogin } = useContext(Context);
  const Navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        displayName: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
      };

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userData, { merge: true });
      setCurrentUser(user);
      console.log(user);
      toast.success(`Welcome, ${user.displayName} !`);
      console.log(pathAfterLogin);
      Navigate(pathAfterLogin);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="Login">
      <div className="container">
        <div className="logos">
          <img
            src={woodlandLogo}
            alt="Nike Logo"
            onClick={() => Navigate("/")}
          />
        </div>
        <header>
          <p className="heading">Login to Mangastore account</p>
        </header>
        <main>
          <div className="sign-in-with-google" onClick={handleSignIn}>
            <img src={googleLogo} alt="Google Logo" />
            <p>Continue with Google</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
