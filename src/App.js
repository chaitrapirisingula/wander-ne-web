import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db, analytics } from "./Data/Firebase";
import { logEvent } from "firebase/analytics";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Home from "./Pages/Home";
import Sites from "./Pages/Sites";
import Regions from "./Pages/Regions";
import ErrorPage from "./Pages/ErrorPage";
import SitePage from "./Pages/SitePage";
import Header from "./Components/Header";
import Loading from "./Components/Loading";

function App() {
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState({});

  const [linksLoaded, setLinksLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getSites = async () => {
      try {
        const sitesRef = collection(db, "2024_sites");
        const data = await getDocs(query(sitesRef, orderBy("name")));
        const sitesData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSites(sitesData);
        setLoaded(true);
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

  return (
    <Router>
      <Header links={linksLoaded ? links : {}} />
      {error ? (
        <div className="p-5 grid justify-items-center">
          <h4 className="text-xl font-semibold text-red-600">
            An error occurred. Please try again later.
          </h4>
        </div>
      ) : (
        <></>
      )}
      {!loaded && !error ? (
        <div className="bg-yellow-100 font-oswald">
          <Loading />
        </div>
      ) : (
        <></>
      )}
      {loaded && linksLoaded && !error ? (
        <div className="mt-16 font-oswald">
          <Routes>
            <Route path="/" element={<Home sites={sites} links={links} />} />
            <Route path="/explore" element={<Sites sites={sites} />} />
            <Route path="/explore/:site" element={<SitePage sites={sites} />} />
            <Route path="/regions" element={<Regions sites={sites} />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      ) : (
        <></>
      )}
    </Router>
  );
}

export default App;
