import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import MapboxGL from "mapbox-gl";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import SearchBar from "../Components/SearchBar";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = ({ sites }) => {
  const mapContainer = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 41.4925, // Default center in Nebraska
    longitude: -99.9018,
    zoom: 10,
  });

  const map = useRef(null);

  // Initialize map & update view state when user moves map
  useEffect(() => {
    map.current = new MapboxGL.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    });

    map.current.on("moveend", () => {
      const center = map.current.getCenter();
      setViewState((prev) => ({
        ...prev,
        latitude: center.lat,
        longitude: center.lng,
      }));
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

  // Function to calculate distance between two lat-lng coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Filter and sort the sites based on the search query and distance to the view state
  useEffect(() => {
    if (!sites || sites.length === 0) return;

    const filteredAndSortedSites = sites
      .filter((site) =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const distanceA = calculateDistance(
          viewState.latitude,
          viewState.longitude,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distanceB = calculateDistance(
          viewState.latitude,
          viewState.longitude,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distanceA - distanceB;
      });

    setFilteredSites(filteredAndSortedSites);
  }, [searchQuery, sites, viewState]); // Update when search query or view state changes

  // Add markers and handle popup interactions
  useEffect(() => {
    if (!map.current || filteredSites.length === 0) return;

    filteredSites.forEach((site) => {
      const marker = new MapboxGL.Marker()
        .setLngLat([site.coordinates.lng, site.coordinates.lat])
        .addTo(map.current);

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
            width: "250px",
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
      <h3 className="font-bold text-lg mt-2">{site.name}</h3>
      <p className="text-sm text-gray-600">{site.city + ", " + site.state}</p>
      <div className="flex flex-col gap-1">
        <button
          className="mt-2 px-2 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex flex-row items-center gap-1"
          onClick={() => {
            navigate("/explore/" + site.name, {
              state: site,
            });
            window.scrollTo(0, 0);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <p>Learn More</p>
        </button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            site.name +
              " " +
              site.address +
              " " +
              site.city +
              " " +
              site.state +
              " " +
              site.zipCode
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 px-2 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex flex-row items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
            />
          </svg>

          <p>Directions</p>
        </a>
      </div>
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
