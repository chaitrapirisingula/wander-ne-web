import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import LocationsBg from "../Images/MapBG.png";
import ChimneyRock from "../Images/ChimneyRock.png";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import NSHSF from "../Images/NSHSFLogo.png";
import Merch from "../Images/Merch.png";
import { useNavigate } from "react-router-dom";

function FeaturedSite({ site }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
      onClick={() => {
        navigate("/explore/" + site.name, { state: site });
        window.scrollTo(0, 0);
      }}
    >
      <img
        src={!imgError && site.image ? site.image : WanderDefaultImage}
        alt={site.name}
        className="w-full h-48 object-cover"
        onError={() => setImgError(true)}
      />
      <div className="p-4">
        <h3 className="text-2xl font-semibold text-blue-700">{site.name}</h3>
        <p className="text-gray-600 mt-2">{site.city + ", " + site.state}</p>
      </div>
    </div>
  );
}

function Home({ sites, links }) {
  const navigate = useNavigate();
  const [siteOne, setSiteOne] = useState({});
  const [siteTwo, setSiteTwo] = useState({});
  const [siteThree, setSiteThree] = useState({});

  useEffect(() => {
    const getFeaturedSites = () => {
      setSiteOne(sites[Math.floor(Math.random() * sites.length)]);
      setSiteTwo(sites[Math.floor(Math.random() * sites.length)]);
      setSiteThree(sites[Math.floor(Math.random() * sites.length)]);
    };
    getFeaturedSites();
  }, [sites]);

  return (
    <div className="bg-yellow-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>WanderNebraska</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-blue-500 text-white">
        <img
          src={ChimneyRock}
          alt="wanderNE"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl tracking-wide">
              WanderNebraska
            </h1>
            <p className="mt-4 text-lg md:text-xl">
              A statewide travel adventure program.
            </p>
            <button
              onClick={() => {
                navigate("/explore");
                window.scrollTo(0, 0);
              }}
              className="mt-6 px-6 py-3 text-lg font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 hover:from-yellow-400 hover:to-yellow-500 text-blue-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            >
              Start Exploring!
            </button>
          </div>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-blue-700">
            Featured Attractions
          </h2>
          <p className="mt-4 text-gray-700">
            Discover the must-see destinations that make Nebraska unforgettable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <FeaturedSite site={siteOne} />
            <FeaturedSite site={siteTwo} />
            <FeaturedSite site={siteThree} />
          </div>
          <button
            onClick={() => {
              navigate("/map");
              window.scrollTo(0, 0);
            }}
            className="mt-10 px-6 py-3 text-lg font-bold bg-blue-500  hover:bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            View Full Map
          </button>
        </div>
      </section>

      {/* Merch Section */}
      <section className="relative text-white py-16">
        <img
          src={LocationsBg}
          alt="Merch Background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-yellow-400">
            WanderNebraska Merch
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-white">
            Show off your Nebraska pride with exclusive WanderNebraska gear!
          </p>
          <div className="flex flex-col items-center justify-center gap-8">
            <img
              src={Merch}
              alt="WanderNebraska Merch"
              className="w-3/4 max-w-2xl"
            />
            <div className="flex flex-col items-center text-center">
              <p className="text-lg text-white mb-4">
                Shirts, socks, and more — perfect for your next adventure.
              </p>
              <a
                href={links.merch}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-6 py-3 text-lg font-bold bg-yellow-400 text-blue-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booklet Flipbook */}
      <section className="py-16 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Explore the WanderNebraska Booklet
        </h2>
        <p className="text-gray-600 max-w-2xl mb-6 flex flex-col">
          Flip through the digital version below
        </p>
        <div className="flex justify-center items-center w-full">
          <iframe
            title="booklet"
            src="https://heyzine.com/flip-book/39d788e0af.html"
            className="border border-gray-300 rounded-md w-full max-w-3xl h-[500px] shadow-sm"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Donation Section */}
      <section className="relative text-white py-16">
        <img
          src={LocationsBg}
          alt="Donation Background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold mb-4">
            Support WanderNebraska
          </h2>
          <p className="text-lg mb-6">
            Help us keep the adventure going! Your donation helps us highlight
            Nebraska’s heritage attractions.
          </p>
          <a
            href={links.donation}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            Donate Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col justify-center items-center py-8">
        <a href={links.nshsf_website} target="_blank" rel="noreferrer">
          <img src={NSHSF} alt="NSHSF" className="cursor-pointer w-48" />
        </a>
        <div className="container mx-auto text-center">
          <p className="text-lg font-light">
            &copy; Nebraska State Historical Society Foundation.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <a
              href={links.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6 text-blue-600" />
            </a>
            <a
              href={links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="w-6 h-6 text-blue-400" />
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 text-pink-500" />
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6 text-blue-700" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
