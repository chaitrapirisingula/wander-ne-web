import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import { normalizeSearchable } from "../Data/searchUtils";

const SHARED_EVENTS = [
  {
    id: "walk-to-the-rock",
    title: "Chimney Rock: Walk to the Rock Trails",
    locationLabel: "Trails at Chimney Rock (Trailhead A at Patio)",
    cityLabel: "Bayard",
    date: "May 23, 2026",
    siteNameForLink: "Chimney Rock: Walk to the Rock Trails",
  },
  {
    id: "rock-creek-station",
    title: "Rock Creek Station State Historical Park",
    locationLabel: "Rock Creek Station State Historical Park",
    cityLabel: "Fairbury",
    date: "June 6, 2026",
    siteNameForLink: "Rock Creek Station State Historical Park",
  },
  {
    id: "alkali-station",
    title: "Alkali Station",
    locationLabel: "Alkali Station",
    cityLabel: "Ogallala",
    date: "June 13, 2026",
    address: "1171 E 80th Rd, Ogallala",
    note: "Does not have a WanderNebraska listing.",
  },
  {
    id: "l-c-visitor-center",
    title: "Missouri River Basin Lewis & Clark Trail Visitor Center",
    locationLabel: "Missouri River Basin Lewis & Clark Trail Visitor Center",
    cityLabel: "Nebraska City",
    date: "July 11, 2026",
    siteNameForLink: "Missouri River Basin Lewis & Clark Trail Visitor Center",
  },
  {
    id: "buffalo-bill-ranch",
    title: "Buffalo Bill Ranch State Historical Park",
    locationLabel: "Buffalo Bill Ranch State Historical Park",
    cityLabel: "North Platte",
    date: "July 11, 2026",
    siteNameForLink: "Buffalo Bill Ranch State Historical Park",
  },
  {
    id: "engineer-cantonment",
    title: "Engineer Cantonment Site",
    locationLabel: "Engineer Cantonment Site",
    cityLabel: "Omaha",
    date: "September 12, 2026",
    address: "County Road P51 and Bluebird Lane, Omaha",
    note: "Does not have a WanderNebraska listing.",
  },
];

function findSiteByName(sites, name) {
  const target = normalizeSearchable(name);
  if (!target) return null;
  return (
    (sites || []).find((s) => normalizeSearchable(s?.name) === target) || null
  );
}

function SiteThumb({ site }) {
  const [imgError, setImgError] = useState(false);
  const src = !imgError && site?.image ? site.image : WanderDefaultImage;
  return (
    <img
      src={src}
      alt={site?.name || "Site"}
      className="h-full w-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

export default function SharedEventsToursPage({ sites }) {
  const navigate = useNavigate();

  const cards = useMemo(() => {
    return SHARED_EVENTS.map((ev) => {
      const site = ev.siteNameForLink
        ? findSiteByName(sites, ev.siteNameForLink)
        : null;
      return { ev, site };
    });
  }, [sites]);

  return (
    <div className="min-h-screen bg-yellow-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Special Shared Events/Tours | WanderNebraska</title>
      </Helmet>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700">
            Special Shared Events/Tours
          </h1>
          <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
            Join us at these highlighted shared events and tours across
            Nebraska. Tap a card to view the WanderNebraska listing when
            available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ ev, site }) => (
            <div
              key={ev.id}
              className="rounded-2xl border border-yellow-200 bg-white shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative h-44 w-full bg-gray-100">
                <SiteThumb site={site} />
                <div className="absolute top-3 left-3 rounded-full bg-blue-700/95 px-3 py-1 text-xs font-bold text-white shadow">
                  {ev.date}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                  {ev.title}
                </h2>
                <p className="mt-2 text-gray-700">
                  <span className="font-semibold">Location:</span>{" "}
                  {ev.locationLabel}
                </p>
                {ev.address && (
                  <p className="mt-1 text-gray-700">
                    <span className="font-semibold">Address:</span> {ev.address}
                  </p>
                )}
                {ev.cityLabel && (
                  <p className="mt-1 text-gray-600">
                    <span className="font-semibold">City:</span> {ev.cityLabel}
                  </p>
                )}
                {ev.note && (
                  <p className="mt-3 text-sm text-amber-800 font-medium">
                    {ev.note}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  {site ? (
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/explore/${encodeURIComponent(site.name)}`, {
                          state: site,
                        });
                        window.scrollTo(0, 0);
                      }}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-white font-bold hover:bg-blue-500 transition"
                    >
                      View listing
                    </button>
                  ) : (
                    <div className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-gray-600 font-semibold text-center">
                      No listing
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
