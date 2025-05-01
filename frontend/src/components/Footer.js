import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Healthy Food Checker. All rights reserved.</p>
        <p>Designed with ❤️</p>
      </div>
    </footer>
  );
}

export default Footer;
