import { React, useContext } from "react";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Offers from "../../components/Offers";
import "./Home.scss";
import LandingPage from "../../components/LandingPage";
import Footer from "../../components/Footer";
import WritingTools from "../../components/WritingTools";
import { Context } from "../../context/ContextProvider";

const Home = () => {
  return (
    <div>
      <TopBar />
      <Navbar />
      <LandingPage />
      {/* <Offers /> */}
      <Footer />
    </div>
  );
};

export default Home;
