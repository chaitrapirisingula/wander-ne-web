import { normalizeExternalUrl } from "../Data/chamberSponsors";

/** Shown under SearchBar when search matches a chamber sponsor city. */
export default function ChamberSponsorHint({ sponsor }) {
  if (!sponsor?.link) return null;
  const city = (sponsor.city || "Local").trim();
  const href = normalizeExternalUrl(sponsor.link);
  if (!href) return null;

  return (
    <div className="mt-3 w-full max-w-md mx-auto rounded-lg border-2 border-blue-600 bg-white/90 px-4 py-3 text-center shadow-sm">
      <p className="text-base text-gray-800 md:text-lg">
        Chamber of Commerce Sponsor:{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-blue-700 hover:underline"
        >
          {city}
        </a>
      </p>
    </div>
  );
}
