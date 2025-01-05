import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ImageMapper from "react-img-mapper";
import { logEvent } from "firebase/analytics";
import { collection, getDocs } from "firebase/firestore";
import { db, analytics } from "../Data/Firebase";
import RegionsMap from "../Images/RegionsMap.png";
import WanderDefaultImg from "../Images/WanderDefaultImage.png";
import Loading from "../Components/Loading";
import { REGIONS_MAP } from "../Data/Constants";
import { useNavigate } from "react-router-dom";

function SiteMiniCard({ site }) {
  const [imgError, setImgError] = useState(false);
  let navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/explore/" + site.name, { state: site });
        window.scrollTo(0, 0);
      }}
      className="cursor-pointer bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 p-4"
    >
      <img
        src={!imgError && site.image ? site.image : WanderDefaultImg}
        alt={site.name}
        className="h-32 w-full object-cover rounded-lg mb-4"
        onError={() => setImgError(true)}
      />
      <h4 className="text-lg font-bold text-blue-700">{site.name}</h4>
      <p className="text-gray-600">{site.city}</p>
    </div>
  );
}

function Regions({ sites }) {
  const [currArea, setCurrArea] = useState({});
  const [regions, setRegions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const currRegion = currArea.name
    ? regions.find((region) => region.name === currArea.name)
    : {};
  const regionSites = sites.filter((site) => site.region === currRegion.name);

  const nickname = currRegion.nickname || "Regions";
  const description = currRegion.description || "";

  const clicked = (area) => {
    setCurrArea(area);
    logEvent(analytics, `${area.name}_clicked`);
  };

  const clickedOutside = () => {
    setCurrArea({});
  };

  useEffect(() => {
    const getRegions = async () => {
      try {
        const regionsRef = collection(db, "regions");
        const data = await getDocs(regionsRef);
        const regionsData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRegions(regionsData);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setError(true);
        logEvent(analytics, "error_fetching_regions");
      }
    };
    getRegions();
    logEvent(analytics, "map_visit");
  }, [loaded]);

  return (
    <div className="bg-yellow-100 min-h-screen py-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Regions</title>
      </Helmet>

      {error ? (
        <div className="text-center py-12">
          <h4 className="text-xl text-red-600">
            An error occurred while fetching data. Please try again later.
          </h4>
        </div>
      ) : !loaded ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-blue-700">{nickname}</h2>
            {currRegion.name && (
              <p className="text-lg text-gray-600 mt-2">{currRegion.name}</p>
            )}
          </div>

          {/* Map and Details Section */}
          <div className="flex flex-col gap-8">
            {/* Map */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl overflow-scroll">
                <ImageMapper
                  src={RegionsMap}
                  map={REGIONS_MAP}
                  width={700}
                  height={300}
                  onClick={clicked}
                  onImageClick={clickedOutside}
                  className="shadow-md rounded-lg"
                />
              </div>
            </div>

            {/* Region Details */}
            <div className="flex flex-col">
              {currRegion.name ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-700 text-lg">{description}</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600">
                    Click on a region to learn more about it.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sites in the Selected Region */}
          <div className="mt-8">
            {currRegion.name && (
              <>
                <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                  Attractions in {currRegion.name}
                </h3>
                {regionSites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regionSites.map((site) => (
                      <SiteMiniCard site={site} key={site.id} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No sites are currently listed for this region.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Regions;
