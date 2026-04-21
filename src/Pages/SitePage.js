import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { logEvent } from "firebase/analytics";
import { analytics } from "../Data/Firebase";
import Loading from "../Components/Loading";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";
import WanderDefaultImageTransparent from "../Images/WanderDefaultImageTransparent.png";
import ErrorPage from "./ErrorPage";
import { SITE_TAGS } from "../Data/Constants";
import YourParksLogo from "../Images/your-parks-adventure-logo.png";
import { isSpecial50Site, Special50Badge } from "../Components/Special50Badge";
import ChamberSponsorHint from "../Components/ChamberSponsorHint";
import { findChamberSponsorForCity } from "../Data/chamberSponsors";
import { useChamberSponsors } from "../hooks/useChamberSponsors";

export default function SitePage({ sites }) {
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState({});
  const [imgError, setImgError] = useState(false);

  const location = useLocation();
  const routeParams = useParams();
  const chamberSponsors = useChamberSponsors();

  const chamberMatch = useMemo(
    () => findChamberSponsorForCity(chamberSponsors, site?.city),
    [chamberSponsors, site?.city]
  );

  useEffect(() => {
    try {
      if (location.state) {
        setSite(location.state);
      } else {
        setSite(sites.find((s) => s.name === routeParams.site));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-yellow-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{site.name}</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Site Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700">{site.name}</h1>
          <p className="text-gray-600 text-lg mt-2">{site.region}</p>
        </div>

        {chamberMatch && (
          <div className="max-w-2xl mx-auto mb-6">
            <ChamberSponsorHint sponsor={chamberMatch} />
          </div>
        )}

        {isSpecial50Site(site) && (
          <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-green-200 bg-green-50 p-4 text-left">
            <div className="flex items-center gap-1.5 mb-3">
              <img
                src={YourParksLogo}
                alt="Your Parks Adventure"
                className="h-14 w-14 object-contain shrink-0"
              />
              <img
                src={WanderDefaultImageTransparent}
                alt="WanderNebraska"
                className="h-14 w-auto max-w-[150px] object-contain object-left shrink-0"
              />
            </div>
            <p className="text-gray-800 text-base leading-relaxed mb-3">
              This site is one of the 50 designated Trail Trek & WanderNebraska
              Special Sites.
            </p>
            <p className="text-gray-800 text-base leading-relaxed mb-3">
              To check in, find the Trail Trek sign, snap a selfie, then scan
              the QR code to submit your photo and register your stop.
            </p>
            <a
              href="https://yourparksadventure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-base block"
            >
              Learn more at yourparksadventure.com
            </a>
          </div>
        )}

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={!imgError && site.image ? site.image : WanderNebraskaLogo}
                alt={site.name}
                className="rounded-lg shadow-lg w-full object-cover"
                onError={() => setImgError(true)}
              />
              {isSpecial50Site(site) && <Special50Badge />}
            </div>
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
                  <strong>Facebook:</strong>{" "}
                  {site.facebook ? (
                    <a
                      href={site.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {site.facebook}
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
                  {site.hours.split(",").map((hour, index) => (
                    <li key={index}>{hour}</li>
                  ))}
                </ul>
              </div>
              {/* Notes */}
              {site.notes && (
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">Notes</h2>
                  <p className="text-gray-700">{site.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        {site.features && site.features.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">
              Features
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {SITE_TAGS.filter((feature) =>
                site.features.includes(feature.name)
              ).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-lg"
                >
                  {feature.icon}
                  <span className="text-gray-700">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            src={`https://maps.google.com/maps?q=${
              site.name +
              " " +
              site.address +
              " " +
              site.city +
              " " +
              site.state +
              " " +
              site.zipCode
            }&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            title="Google Maps"
            className="w-8/12 h-64 rounded-lg shadow-md"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
