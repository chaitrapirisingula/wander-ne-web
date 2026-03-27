import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import MapboxGL from "mapbox-gl";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import SearchBar from "../Components/SearchBar";
import { isSpecial50Site, Special50Badge } from "../Components/Special50Badge";
import { siteKey, dedupeSitesByKey } from "../Data/siteUtils";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

/** Same validity check as wander-ne-mobile before placing a marker. */
function isValidMarkerPosition(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  return (
    !Number.isNaN(la) &&
    !Number.isNaN(ln) &&
    ln >= -180 &&
    ln <= 180 &&
    la >= -90 &&
    la <= 90 &&
    !(ln === 0 && la === 0)
  );
}

/** Parse latitude/longitude from site (numbers or numeric strings). */
function parseLatLngPair(site) {
  if (!site) return null;
  let lat = site.latitude;
  let lng = site.longitude;
  if (lat != null && typeof lat !== "number") lat = parseFloat(lat);
  if (lng != null && typeof lng !== "number") lng = parseFloat(lng);
  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    isValidMarkerPosition(lat, lng)
  ) {
    return { lat, lng };
  }
  return null;
}

/** Legacy shapes: coordinates.lat/lng or [lng, lat]. */
function parseLegacyCoordinates(site) {
  const c = site.coordinates;
  if (c && typeof c.lat === "number" && typeof c.lng === "number") {
    if (isValidMarkerPosition(c.lat, c.lng)) return { lat: c.lat, lng: c.lng };
  }
  if (c && Array.isArray(c) && c.length >= 2) {
    const lng = Number(c[0]);
    const lat = Number(c[1]);
    if (isValidMarkerPosition(lat, lng)) return { lat, lng };
  }
  return null;
}

/** Geocode address using Mapbox Geocoding API (same as wander-ne-mobile). */
async function geocodeAddress(address, city, state) {
  if (!MAPBOX_TOKEN || !address) return null;
  try {
    const query = [address, city, state].filter(Boolean).join(", ");
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        !Number.isNaN(lat) &&
        !Number.isNaN(lng)
      ) {
        return { lat, lng };
      }
    }
    return null;
  } catch (e) {
    console.error("Geocoding error:", e);
    return null;
  }
}

/** Resolve direct coords (mobile: only number lat/lng; we also accept strings). */
function resolveDirectCoordinates(site) {
  return parseLatLngPair(site) || parseLegacyCoordinates(site);
}

const MapPage = ({ sites }) => {
  const mapContainer = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  /** Sites with resolved lat/lng (same pipeline as mobile: direct + geocoded). */
  const [sitesWithCoords, setSitesWithCoords] = useState([]);
  const [geocoding, setGeocoding] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 41.4925,
    longitude: -99.9018,
    zoom: 10,
  });

  const map = useRef(null);
  const markersRef = useRef([]);
  const geocodeGeneration = useRef(0);

  // Build sitesWithCoords: direct coordinates first, then Mapbox geocode for the rest (wander-ne-mobile)
  useEffect(() => {
    if (!sites || sites.length === 0) {
      setSitesWithCoords([]);
      setGeocoding(false);
      return;
    }

    setGeocoding(false);
    const gen = ++geocodeGeneration.current;
    const initial = [];
    const toGeocode = [];

    const uniqueSites = dedupeSitesByKey(sites);
    uniqueSites.forEach((site) => {
      const direct = resolveDirectCoordinates(site);
      if (direct) {
        initial.push({ ...site, lat: direct.lat, lng: direct.lng });
      } else if (site.address) {
        toGeocode.push(site);
      }
    });

    setSitesWithCoords(dedupeSitesByKey(initial));

    if (toGeocode.length === 0) return;

    setGeocoding(true);
    (async () => {
      const geocodedResults = await Promise.all(
        toGeocode.map(async (site) => {
          const coords = await geocodeAddress(
            site.address,
            site.city,
            site.state
          );
          if (
            coords &&
            isValidMarkerPosition(coords.lat, coords.lng)
          ) {
            return { ...site, lat: coords.lat, lng: coords.lng };
          }
          return null;
        })
      );

      if (gen !== geocodeGeneration.current) {
        setGeocoding(false);
        return;
      }

      const merged = geocodedResults.filter(Boolean);
      // Single atomic update with captured `initial` — never append to stale `prev`
      // (avoids duplicates when `sites` re-runs or overlapping async completions).
      setSitesWithCoords(dedupeSitesByKey([...initial, ...merged]));
      setGeocoding(false);
    })();
  }, [sites]);

  // Initialize map & update view state when user moves map
  useEffect(() => {
    map.current = new MapboxGL.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      accessToken: MAPBOX_TOKEN,
    });

    map.current.on("moveend", () => {
      const center = map.current.getCenter();
      setViewState((prev) => ({
        ...prev,
        latitude: center.lat,
        longitude: center.lng,
      }));
    });

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
        if (map.current) {
          map.current.flyTo({
            center: [newViewState.longitude, newViewState.latitude],
            zoom: newViewState.zoom,
          });
        }
      },
      (error) => console.error("Error fetching location: ", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Derive list once — avoids duplicate rows when viewState updates (map pan) retriggered effects
  const filteredSites = useMemo(() => {
    const deduped = dedupeSitesByKey(sitesWithCoords);
    if (!deduped.length) return [];

    const q = searchQuery.trim().toLowerCase();
    const matched = q
      ? deduped.filter((site) => {
          const name = (site.name || "").toLowerCase();
          const city = (site.city || "").toLowerCase();
          return name.includes(q) || city.includes(q);
        })
      : deduped;

    return [...matched].sort((a, b) => {
      return (
        calculateDistance(
          viewState.latitude,
          viewState.longitude,
          a.lat,
          a.lng
        ) -
        calculateDistance(
          viewState.latitude,
          viewState.longitude,
          b.lat,
          b.lng
        )
      );
    });
  }, [
    sitesWithCoords,
    searchQuery,
    viewState.latitude,
    viewState.longitude,
    calculateDistance,
  ]);

  // Markers: one per filtered site (all have lat/lng)
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredSites.forEach((site) => {
      const marker = new MapboxGL.Marker()
        .setLngLat([site.lng, site.lat])
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        setSelectedSite(site);
        map.current.flyTo({
          center: [site.lng, site.lat],
          zoom: 12,
        });
      });

      markersRef.current.push(marker);
    });
  }, [filteredSites]);

  return (
    <div className="relative h-screen w-screen font-oswald">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {geocoding && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-white/95 px-4 py-2 rounded-lg shadow text-sm text-gray-800">
          Geocoding addresses…
        </div>
      )}
      <div className="absolute top-0 left-0 w-1/3 h-screen overflow-y-auto shadow-lg p-4 bg-yellow-50/95">
        <div className="pb-4">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
        {!MAPBOX_TOKEN && (
          <p className="text-sm text-red-600 mb-2">
            REACT_APP_MAPBOX_TOKEN is missing; geocoding will not run.
          </p>
        )}
        {filteredSites.map((site) => (
          <SiteCard
            key={siteKey(site)}
            site={site}
            onClick={() => {
              setSelectedSite(site);
              if (map.current) {
                map.current.flyTo({
                  center: [site.lng, site.lat],
                  zoom: 12,
                });
              }
            }}
          />
        ))}
        {sitesWithCoords.length === 0 && !geocoding && sites?.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            No sites with location data yet. Add coordinates or addresses in
            Firebase.
          </p>
        )}
      </div>

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
            <PopupCard site={selectedSite} />
            <button
              className="text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setSelectedSite(null)}
              aria-label="Close"
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
      <div className="relative inline-block w-full">
        <img
          src={!imgError && site.image ? site.image : WanderNebraskaLogo}
          alt={site.name}
          className="rounded-lg shadow-lg h-32 w-full object-cover"
          onError={() => setImgError(true)}
        />
        {isSpecial50Site(site) && <Special50Badge />}
      </div>
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
      <div className="flex-1 p-2">
        <h3 className="font-bold text-center md:text-left">{site.name}</h3>
        <p className="hidden sm:flex text-sm text-gray-600 text-center md:text-left">{`${site.address}, ${site.city}, ${site.state} ${site.zipCode}`}</p>
      </div>

      <div className="hidden sm:flex w-32 h-16 flex-shrink-0 relative">
        <img
          src={!imgError && site.image ? site.image : WanderNebraskaLogo}
          alt={site.name}
          className="rounded-lg shadow-lg w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
        {isSpecial50Site(site) && <Special50Badge compact />}
      </div>
    </div>
  );
};

export default MapPage;
