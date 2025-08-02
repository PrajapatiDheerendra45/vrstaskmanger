import React, { useEffect } from "react";
import "./Loader.css"; // Import the CSS file for styles

const Loader = () => {
  useEffect(() => {
    const particlesContainer = document.querySelector(".particles");
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 3 + "s";
      particlesContainer.appendChild(particle);
    }
  }, []);

  return (
    <div className="loader-container maindiv">
      <div className="loader-wrapper">
        {/* Scanning Line */}
        <div className="scanner"></div>
        {/* Floating Particles */}
        <div className="particles"></div>
        {/* SVG Loader with Circles */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <circle className="circle outer" cx="50" cy="50" r="45" />
          <circle className="circle middle" cx="50" cy="50" r="35" />
          <circle className="circle inner" cx="50" cy="50" r="25" />
          {/* Corner Dots */}
          <circle className="dots" cx="50" cy="5" r="2" />
          <circle className="dots" cx="95" cy="50" r="2" />
          <circle className="dots" cx="50" cy="95" r="2" />
          <circle className="dots" cx="5" cy="50" r="2" />
        </svg>
        {/* Loading Text */}
        <div className="progress-text">SYSTEM LOADING...</div>
      </div>
    </div>
  );
};
export default Loader;
