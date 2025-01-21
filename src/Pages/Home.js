import React from "react";
import { Helmet } from "react-helmet";
import LocationsBg from "../Images/MapBG.png";
import ChimneyRock from "../Images/ChimneyRock.png";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import NSHSF from "../Images/NSHSFLogo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-yellow-500 text-white">
        <img
          src={LocationsBg}
          alt="wanderNE"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-extrabold">
              Your Nebraska Adventure Awaits!
            </h2>
            <p className="mt-4 text-lg">
              See what Nebraska has to offer across all regions.
            </p>
            <button
              onClick={() => {
                navigate("/regions");
                window.scrollTo(0, 0);
              }}
              className="mt-6 px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            >
              View Map
            </button>
          </div>
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
              className="hover:text-yellow-400 text-lg font-light"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href={links.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400 text-lg font-light"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400 text-lg font-light"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400 text-lg font-light"
              aria-label="Instagram"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
