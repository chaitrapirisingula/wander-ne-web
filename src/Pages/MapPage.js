import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import SearchBar from "../Components/SearchBar";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = ({ sites }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [geocodedSites, setGeocodedSites] = useState([]);
  const [sortedSites, setSortedSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 41.4925, // Default center in Nebraska
    longitude: -99.9018,
    zoom: 10,
  });

  // Fetch user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12,
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

  // Sort and filter sites by proximity and search query
  useEffect(() => {
    if (!viewState || geocodedSites.length === 0) return;

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const toRadians = (deg) => (deg * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in kilometers

      const dLat = toRadians(lat2 - lat1);
      const dLng = toRadians(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in kilometers
    };

    const query = searchQuery.trim().toLowerCase();

    const filteredAndSorted = geocodedSites
      .filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.city.toLowerCase().includes(query)
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

    setSortedSites(filteredAndSorted);
  }, [viewState, geocodedSites, searchQuery]);

  return (
    <div className="relative h-screen w-screen">
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />

        {/* Markers */}
        {geocodedSites.map((site) => (
          <Marker
            key={site.id}
            latitude={site.coordinates.lat}
            longitude={site.coordinates.lng}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedSite(site);
            }}
          >
            <div className="text-blue-500 text-2xl cursor-pointer">📍</div>
          </Marker>
        ))}

        {/* Popup for selected site */}
        {selectedSite && (
          <Popup
            latitude={selectedSite.coordinates.lat}
            longitude={selectedSite.coordinates.lng}
            onClose={() => setSelectedSite(null)}
            closeOnClick={true}
            closeButton={false}
          >
            <PopupCard site={selectedSite} />
          </Popup>
        )}
      </Map>

      {/* Site Cards */}
      <div className="absolute top-0 left-0 w-1/3 h-screen overflow-y-auto shadow-lg p-4">
        <div className="pb-4">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
        {sortedSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onClick={() => {
              setSelectedSite(site);
              setViewState({
                latitude: site.coordinates.lat,
                longitude: site.coordinates.lng,
                zoom: 12,
              });
            }}
          />
        ))}
      </div>
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
