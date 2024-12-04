import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WanderNebraskaLogo from "../Images/WanderNebraskaLogo.png";

function Header({ links }) {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white fixed w-full top-0 z-50 shadow-md font-oswald">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <img
          src={WanderNebraskaLogo}
          alt="Home"
          onClick={() => {
            navigate("/explore");
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          className="cursor-pointer h-16"
        />

        {/* Navigation Links for Desktop */}
        <nav className="hidden md:flex space-x-8">
          <div
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer hover:text-yellow-400 transition duration-300"
          >
            About
          </div>
          <div
            onClick={() => {
              navigate("/regions");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer hover:text-yellow-400 transition duration-300"
          >
            Regions
          </div>
          <a
            href={links.donation}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer hover:text-yellow-400 transition duration-300"
          >
            Support
          </a>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open Menu</span>
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // Cross icon when menu is open
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger menu icon when closed
              }
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-blue-800 text-white">
          <div
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            className="cursor-pointer block py-2 px-4 hover:bg-blue-600 transition duration-300"
          >
            About
          </div>
          <div
            onClick={() => {
              navigate("/regions");
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            className="cursor-pointer block py-2 px-4 hover:bg-blue-600 transition duration-300"
          >
            Regions
          </div>
          <a
            href={links.donation}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer block py-2 px-4 hover:bg-blue-600 transition duration-300"
          >
            Support
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;
