import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5"; // Import the close icon from react-icons
import MapboxGL from "mapbox-gl";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import SearchBar from "../Components/SearchBar";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = ({ sites }) => {
  const mapContainer = useRef(null); // Ref for map container
  const [searchQuery, setSearchQuery] = useState("");
  const [geocodedSites, setGeocodedSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 41.4925, // Default center in Nebraska
    longitude: -99.9018,
    zoom: 10,
  });

  const map = useRef(null);

  // Initialize the map
  useEffect(() => {
    map.current = new MapboxGL.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    });

    // Clean up the map when the component unmounts
    return () => map.current.remove();
  }, []);

  // Fetch user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newViewState = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12,
        };
        setViewState(newViewState);
        map.current.flyTo({
          center: [newViewState.longitude, newViewState.latitude],
          zoom: newViewState.zoom,
        });
      },
      (error) => console.error("Error fetching location: ", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Geocode addresses using fetch
  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!sites || sites.length === 0) {
        console.error("No sites provided to geocode.");
        return;
      }

      const geocoded = await Promise.all(
        sites.map(async (site) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                `${site.address}, ${site.city}, ${site.state}, ${site.zipCode}`
              )}.json?access_token=${
                process.env.REACT_APP_MAPBOX_TOKEN
              }&limit=1`
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${site.name}`);
            }

            const data = await response.json();
            if (data.features.length === 0) {
              throw new Error(`No results found for ${site.name}`);
            }

            const [lng, lat] = data.features[0].center;
            return { ...site, coordinates: { lat, lng } };
          } catch (error) {
            console.error(`Error geocoding ${site.name}:`, error);
            return null;
          }
        })
      );

      setGeocodedSites(geocoded.filter((site) => site !== null));
    };

    geocodeAddresses();
  }, [sites]);

  // Filter sites based on search query
  const filteredSites = geocodedSites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add markers and handle popup interactions
  useEffect(() => {
    if (!map.current || filteredSites.length === 0) return;

    // Add markers to the map
    filteredSites.forEach((site) => {
      const marker = new MapboxGL.Marker()
        .setLngLat([site.coordinates.lng, site.coordinates.lat])
        .addTo(map.current);

      // Open popup on marker click
      marker.getElement().addEventListener("click", () => {
        setSelectedSite(site);
        map.current.flyTo({
          center: [site.coordinates.lng, site.coordinates.lat],
          zoom: 12,
        });
      });
    });
  }, [filteredSites]);

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {/* Site Cards */}
      <div className="absolute top-0 left-0 w-1/3 h-screen overflow-y-auto shadow-lg p-4">
        <div className="pb-4">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
        {filteredSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onClick={() => {
              setSelectedSite(site);
              map.current.flyTo({
                center: [site.coordinates.lng, site.coordinates.lat],
                zoom: 12,
              });
            }}
          />
        ))}
      </div>

      {/* Popup for selected site */}
      {selectedSite && (
        <div
          className="absolute bg-white p-4 rounded-lg shadow-lg"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <div className="flex justify-between items-start">
            {/* PopupCard on the left */}
            <PopupCard site={selectedSite} />

            {/* Close button on the right */}
            <button
              className="text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setSelectedSite(null)} // Close popup
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PopupCard = ({ site }) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-xs">
      <img
        src={!imgError && site.image ? site.image : WanderNebraskaLogo}
        alt={site.name}
        className="rounded-lg shadow-lg h-32"
        onError={() => setImgError(true)}
      />
      <h3 className="font-bold text-lg">{site.name}</h3>
      <p className="text-sm text-gray-600">{site.city + ", " + site.state}</p>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        onClick={() => {
          navigate("/explore/" + site.name, {
            state: site,
          });
          window.scrollTo(0, 0);
        }}
      >
        Learn More
      </button>
    </div>
  );
};

const SiteCard = ({ site, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center flex-col md:flex-row"
      onClick={onClick}
    >
      {/* Left: Site Details */}
      <div className="flex-1 p-2">
        <h3 className="font-bold text-center md:text-left">{site.name}</h3>
        <p className="hidden sm:flex text-sm text-gray-600 text-center md:text-left">{`${site.address}, ${site.city}, ${site.state} ${site.zipCode}`}</p>
      </div>

      {/* Right: Site Image */}
      <div className="hidden sm:flex w-32 h-16 flex-shrink-0">
        <img
          src={!imgError && site.image ? site.image : WanderNebraskaLogo}
          alt={site.name}
          className="rounded-lg shadow-lg w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    </div>
  );
};

export default MapPage;
