import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/Firebase";
import SiteCard from "../Components/SiteCard";
import SearchBar from "../Components/SearchBar";
import { SITE_TAGS } from "../Data/Constants";
import PassportLogo from "../Images/nebraska_passport_2026_logo.png";
import YourParksLogo from "../Images/your-parks-adventure-logo.png";
import { isSpecial50Site } from "../Components/Special50Badge";

function Sites({ sites }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [filterSpecial50, setFilterSpecial50] = useState(false);

  const hasSpecial50Sites = sites.some((s) => isSpecial50Site(s));

  useEffect(() => {
    logEvent(analytics, "sites_visit");
  }, []);

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(
      (prevFeatures) =>
        prevFeatures.includes(feature)
          ? prevFeatures.filter((f) => f !== feature) // Remove if already selected
          : [...prevFeatures, feature] // Add if not selected
    );
  };

  // Filter sites based on search, features, and special50
  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase());

    const features = site.features || [];
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) => features.includes(feature));

    const matchesSpecial50 = !filterSpecial50 || isSpecial50Site(site);

    return matchesSearch && matchesFeatures && matchesSpecial50;
  });

  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Page Metadata */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Explore</title>
      </Helmet>

      {/* Title and Search */}
      <div className="text-center py-8 flex flex-col justify-center items-center gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Attractions</h1>

        <div className="w-full">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>

        {/* Special Sites filter — own row */}
        {hasSpecial50Sites && (
          <div className="max-w-4xl w-full">
            <h2 className="text-xl font-semibold text-blue-700 mb-2 text-center">
              Special program:
            </h2>
            <div className="flex justify-center">
              <button
                type="button"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition border ${
                  filterSpecial50
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
                }`}
                onClick={() => setFilterSpecial50((v) => !v)}
              >
                <img
                  src={YourParksLogo}
                  alt=""
                  className="h-7 w-7 object-contain"
                  aria-hidden
                />
                Special Sites (Trail Trek)
              </button>
            </div>
          </div>
        )}

        {/* Feature Filters */}
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Filter by Features:
          </h2>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {SITE_TAGS.map((feature) => (
              <button
                key={feature.name}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition ${
                  selectedFeatures.includes(feature.name)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => toggleFeature(feature.name)}
              >
                {feature.icon} {feature.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSites.length > 0 ? (
            filteredSites.map((site) => (
              <div key={site.name} className="flex justify-center">
                <SiteCard props={site} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full mt-4">
              No attractions match your filters
            </p>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto text-center py-8 flex flex-col gap-2">
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
    </div>
  );
}

export default Sites;
