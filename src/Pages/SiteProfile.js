import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/firebase";
import Loading from "../Components/Loading";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import ErrorPage from "./ErrorPage";

export default function SiteProfile({ sites }) {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState({});
  const [imgError, setImgError] = useState(false);

  const location = useLocation();
  let routeParams = useParams();

  const fetchSiteInfo = async (data) => {
    try {
      setSite(data);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching site data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      fetchSiteInfo(location.state);
    } else {
      fetchSiteInfo(sites.find((s) => s.name === routeParams.site));
    }
    logEvent(analytics, `${routeParams.site}_visit`);
  }, [location.state, routeParams.site, sites]);

  if (loading) {
    return <Loading />;
  }

  if (!site) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen bg-yellow-100 py-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{site.name}</title>
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Site Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">{site.name}</h1>
          <p className="text-gray-600 text-lg mt-2">{site.region}</p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={!imgError && site.image ? site.image : WanderNebraskaLogo}
              alt={site.name}
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
              onError={() => setImgError(true)}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-600">Contact</h2>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  {site.email ? (
                    <a href={`mailto:${site.email}`} className="text-blue-500">
                      {site.email}
                    </a>
                  ) : (
                    "Not available"
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {site.phone || "Not available."}
                </p>
                <p className="text-gray-700">
                  <strong>Website:</strong>{" "}
                  {site.website ? (
                    <a
                      href={site.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {site.website}
                    </a>
                  ) : (
                    "Not available"
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong>{" "}
                  {site.address +
                    ", " +
                    site.city +
                    ", " +
                    site.state +
                    " " +
                    site.zipCode}
                </p>
              </div>

              {/* Hours of Operation */}
              <div>
                <h2 className="text-xl font-semibold text-blue-600">Hours</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {site.hours.map((hour, index) => (
                    <li key={index}>{hour}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {site.description && (
          <div className="flex flex-col justify-center items-center mt-8 text-center">
            <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">
              Overview
            </h2>
            <p className="text-gray-700 text-lg">{site.description}</p>
          </div>
        )}

        {/* Google Maps Embed */}
        <div className="flex flex-col justify-center items-center mt-8">
          <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">
            Location
          </h2>

          <iframe
            src={`https://maps.google.com/maps?q=
                ${
                  site.name +
                  " " +
                  site.address +
                  " " +
                  site.city +
                  " " +
                  site.state +
                  " " +
                  site.zipCode
                } &t=&z=13&ie=UTF8&iwloc=&output=embed`}
            title="Google Maps"
            className="w-8/12 h-64 rounded-lg shadow-md"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
