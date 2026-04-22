import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import LocationsBg from "../Images/MapBG.png";
import ChimneyRock from "../Images/ChimneyRock.png";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import NSHSF from "../Images/NSHSFLogo.png";
import Merch from "../Images/Merch.png";
import PassportLogo from "../Images/nebraska_passport_2026_logo.png";
import IOSDownload from "../Images/ios-download.png";
import AndroidDownload from "../Images/android-download.png";
import AppPromoOne from "../Images/app-promo-1.png";
import AppPromoTwo from "../Images/app-promo-2.png";
import Nebraska250Logo from "../Images/nebraska_250_logo.png";
import { useNavigate } from "react-router-dom";
import { isSpecial50Site, Special50Badge } from "../Components/Special50Badge";

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
      <div className="relative w-full h-48">
        <img
          src={!imgError && site.image ? site.image : WanderDefaultImage}
          alt={site.name}
          className="w-full h-48 object-cover"
          onError={() => setImgError(true)}
        />
        {isSpecial50Site(site) && <Special50Badge />}
      </div>
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

      {/* Booklet banner */}
      <section className="bg-gray-600/70 text-white py-2 px-4 text-center shadow-md backdrop-blur-sm">
        <p className="text-base md:text-lg font-semibold mb-1">
          Your 2026 Nebraska adventure starts here — order your WanderNebraska
          booklet now! Booklets ship mid-April.
        </p>
        <a
          href="https://secure.qgiv.com/for/wandernebraska/event/wandernebraska2026booklet/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 px-3 py-1.5 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-300 transition"
        >
          Get your booklet →
        </a>
      </section>

      {/* Special shared events/tours banner */}
      <section className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-5 max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700/80">
              Special Shared Events/Tours
            </p>
            <p className="mt-1 text-gray-800 font-semibold">
              Walk to the Rock at Trails at Chimney Rock — May 23, 2026
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/shared-events");
              window.scrollTo(0, 0);
            }}
            className="mx-auto md:mx-0 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-white font-bold hover:bg-blue-500 transition shadow"
          >
            View all 6 dates
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-blue-500 text-white">
        <img
          src={ChimneyRock}
          alt="wanderNE"
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="flex justify-center">
              <div className="flex h-[4.5rem] w-40 shrink-0 items-center justify-center sm:h-20 sm:w-48 md:h-[5.75rem] md:w-56">
                <img
                  src={Nebraska250Logo}
                  alt="Nebraska 250"
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>
            <h1 className="mt-4 text-4xl tracking-wide md:mt-5 md:text-5xl">
              WanderNebraska
            </h1>
            <p className="mt-4 text-base md:text-lg">
              A statewide travel adventure program.
            </p>
            <button
              onClick={() => {
                navigate("/explore");
                window.scrollTo(0, 0);
              }}
              className="mt-4 px-5 py-2.5 text-base font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 hover:from-yellow-400 hover:to-yellow-500 text-blue-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
            >
              Start Exploring!
            </button>
          </div>
        </div>
      </section>

      {/* Mobile App Download + How It Works */}
      <section className="relative py-14 text-white">
        <img
          src={LocationsBg}
          alt="Map background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto rounded-2xl border border-gray-200 bg-white/80 p-6 md:p-8 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700">
              Download the NEW WanderNebraska App!
            </h2>
            <p className="mt-3 text-gray-700 text-center max-w-3xl mx-auto">
              Track your visits, discover historical gems, and make your 2026
              WanderNebraska adventure even easier.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3 items-center">
              <div className="flex flex-col gap-4 items-center">
                <a
                  href="https://apps.apple.com/us/app/wandernebraska/id6760377408"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-110 hover:-translate-y-0.5 transition-transform duration-200"
                  aria-label="Download WanderNebraska on the App Store"
                >
                  <img
                    src={IOSDownload}
                    alt="Download on the App Store"
                    className="h-16 md:h-[72px] w-auto rounded-lg shadow-lg"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.wandernebraska.mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-110 hover:-translate-y-0.5 transition-transform duration-200"
                  aria-label="Get WanderNebraska on Google Play"
                >
                  <img
                    src={AndroidDownload}
                    alt="Get it on Google Play"
                    className="h-16 md:h-[72px] w-auto rounded-lg shadow-lg"
                  />
                </a>
              </div>
              <img
                src={AppPromoOne}
                alt="WanderNebraska app sites view"
                className="w-full max-w-[260px] justify-self-center rounded-xl border border-gray-200 shadow-lg"
              />
              <img
                src={AppPromoTwo}
                alt="WanderNebraska app profile view"
                className="w-full max-w-[260px] justify-self-center rounded-xl border border-gray-200 shadow-lg"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center text-gray-800">
                How it works
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    Download the app and create an account.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    Visit a WanderNebraska site and log your visit in the app.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    Or scan the QR code at the site to log your visit.
                  </p>
                </div>
              </div>
            </div>
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
        <p className="text-xl md:text-2xl text-gray-800 max-w-2xl mb-4">
          <a
            href="https://secure.qgiv.com/for/wandernebraska/event/wandernebraska2026booklet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            Order your 2026 booklet
          </a>
          {" — your guide to exploring Nebraska, mailed in mid-April!"}
        </p>
        <p className="text-gray-600 max-w-2xl mb-6">
          Flip through the digital booklet below
        </p>
        <div className="flex justify-center items-center w-full">
          <iframe
            title="WanderNebraska 2026 booklet"
            allowFullScreen
            allow="clipboard-write"
            scrolling="no"
            src="https://heyzine.com/flip-book/c8bf67a12e.html"
            className="fp-iframe border border-gray-300 rounded-md w-full max-w-3xl h-[400px] shadow-sm"
          />
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
          <div className="mt-6 bg-gray-200/85 text-gray-900 rounded-xl p-5 shadow-md">
            <h3 className="text-2xl font-bold mb-2">
              Business/Organization Sponsorship Opportunities
            </h3>
            <p className="text-base mb-4">
              Sponsor WanderNebraska 2026 for just $50 to promote your
              community, attract visitors, and have your website featured on
              our site and new mobile app.
            </p>
            <a
              href="https://www.nshsf.org/projects/wandernebraska/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 text-base font-bold bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
            >
              Sponsor WanderNebraska
            </a>
          </div>
        </div>
      </section>

      <section className="py-8 pt-12">
        <div className="max-w-xl mx-auto text-center flex flex-col gap-2">
          <p className="text-lg text-gray-800">
            Discover Nebraska’s Passport Program, your guide to exploring
            restaurants, wineries, retail stores, and more!&nbsp;
            <a
              href="https://nebraskapassport.com/request"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              Click here to request a passport.
            </a>
          </p>

          <a
            href="https://nebraskapassport.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={PassportLogo}
              alt="Nebraska Passport Program"
              className="h-20 mx-auto hover:scale-105 transition-transform duration-200"
            />
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
