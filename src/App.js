import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db, sites_db, analytics } from "./Data/Firebase";
import { logEvent } from "firebase/analytics";
import { collection, getDocs } from "firebase/firestore";
import { ref, get } from "firebase/database";
import Home from "./Pages/Home";
import Sites from "./Pages/Sites";
import ErrorPage from "./Pages/ErrorPage";
import SitePage from "./Pages/SitePage";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import MapPage from "./Pages/MapPage";
import Merch from "./Images/Merch.png"; // merch image

function App() {
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState({});
  const [linksLoaded, setLinksLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const getSites = async () => {
      try {
        const sitesRef = ref(sites_db, "2025_sites");
        const snapshot = await get(sitesRef);
        if (snapshot.exists()) {
          const sitesData = [];
          snapshot.forEach((childSnapshot) => {
            sitesData.push({
              ...childSnapshot.val(),
              id: childSnapshot.key,
            });
          });
          sitesData.sort((a, b) => a.name.localeCompare(b.name));
          setSites(sitesData);
          setLoaded(true);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_sites");
      }
    };

    const getLinks = async () => {
      try {
        const linksRef = collection(db, "links");
        const data = await getDocs(linksRef);
        const linksData = data.docs[0].data();
        setLinks(linksData);
        setLinksLoaded(true);
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_links");
      }
    };

    getSites();
    getLinks();
  }, []);

  // Global Merch Popup Logic
  useEffect(() => {
    const visits = parseInt(localStorage.getItem("merchPopupVisits") || "0");
    localStorage.setItem("merchPopupVisits", visits + 1);

    if (visits % 3 === 0) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Click outside popup to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <Router>
      <Header links={linksLoaded ? links : {}} />

      {/* Global Merch Popup */}
      {showPopup && links?.merch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-oswald p-4">
          <div
            ref={popupRef}
            className="bg-gray-200 p-6 rounded-lg max-w-2xl w-full text-center shadow-lg relative"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={Merch}
              alt="WanderNebraska Merch"
              className="w-full h-auto rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Love Wandering Nebraska?
            </h2>
            <p className="text-gray-700 mb-4">
              Grab exclusive WanderNebraska merch for your next trip!
            </p>
            <a
              href={links.merch}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2 text-white bg-yellow-500 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              Shop Merch
            </a>
          </div>
        </div>
      )}

      {error ? (
        <div className="p-5 grid justify-items-center font-oswald">
          <h4 className="text-xl font-semibold text-red-600">
            An error occurred. Please try again later.
          </h4>
        </div>
      ) : null}

      {!loaded && !error ? (
        <div className="bg-yellow-100 font-oswald">
          <Loading />
        </div>
      ) : null}

      {loaded && linksLoaded && !error ? (
        <div className="mt-16 font-oswald">
          <Routes>
            <Route path="/" element={<Home sites={sites} links={links} />} />
            <Route path="/explore" element={<Sites sites={sites} />} />
            <Route path="/explore/:site" element={<SitePage sites={sites} />} />
            <Route path="/map" element={<MapPage sites={sites} />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      ) : null}
    </Router>
  );
}

export default App;
