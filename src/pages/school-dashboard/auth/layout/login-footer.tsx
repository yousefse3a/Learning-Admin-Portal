import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const LoginFooter: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      {/* Left Section - Links */}
      <div>
        <div className="footer-links">
          <p>Home</p>
          <p>Why !</p>
          <p>What we do ?</p>
          <p>Contact</p>
          <p>Privacy Policy</p>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
        </div>
      </div>

      {/* Right Section - Subscription */}
      <div className="subscribe-section">
        <input type="email" placeholder="Your Email" />
        <button className="subscribe-btn">Subscribe</button>
      </div>
    </footer>
  );
};

export default LoginFooter;
