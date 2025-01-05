import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/Firebase";
import SiteCard from "../Components/SiteCard";
import SearchBar from "../Components/SearchBar";
import { SITE_TAGS } from "../Data/Constants";

function Sites({ sites }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

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

  // Filter sites based on search and selected features
  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.every((feature) => site.features.includes(feature));

    return matchesSearch && matchesFeatures;
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
    </div>
  );
}

export default Sites;
