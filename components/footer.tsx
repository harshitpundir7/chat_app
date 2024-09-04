import React from 'react';
import LinkBtn from './link-btn';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-24">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <p className="text-center md:text-left text-sm md:text-base font-light">
            © 2024 Mingle. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xl">
            <a href="https://facebook.com" className="hover:text-blue-500 transition-colors duration-300">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" className="hover:text-blue-400 transition-colors duration-300">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" className="hover:text-pink-500 transition-colors duration-300">
              <FaInstagram />
            </a>
          </div>
        </div>
        <div className="flex flex-col text-3xl md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <LinkBtn link="/privacy-policy" text="Privacy Policy" />
          <LinkBtn link="/terms-of-service" text="Terms of Service" />
          <LinkBtn link="/contact" text="Contact Us" />
        </div>
      </div>
    </footer>
  );
}
