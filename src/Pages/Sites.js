import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/firebase";
import SiteCard from "../Components/SiteCard";
import SearchBar from "../Components/SearchBar";

function Sites({ sites }) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    logEvent(analytics, "sites_visit");
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Page Metadata */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Explore</title>
      </Helmet>

      {/* Title and Search */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-700">Attractions</h1>
        <div className="mt-4">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
      </div>

      {/* Sites Grid */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites
            .filter(
              (site) =>
                site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                site.city.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((site) => (
              <div key={site.name} className="flex justify-center">
                <SiteCard props={site} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Sites;
