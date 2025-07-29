import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ProgressBar.css";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setProgress(0);
    setIsVisible(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 200); // Hide after 0.5s
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Adjust speed to complete in ~1.5s

    return () => clearInterval(interval);
  }, [location]);

  return (
    isVisible && (
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    )
  );
};

export default ProgressBar;
