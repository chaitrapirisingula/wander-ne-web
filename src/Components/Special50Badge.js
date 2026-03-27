import YourParksLogo from "../Images/your-parks-adventure-logo.png";

/** Matches wander-ne-mobile: Firebase may store boolean true or string "TRUE". */
export function isSpecial50Site(site) {
  if (!site) return false;
  return site.special50 === true || site.special50 === "TRUE";
}

/** Badge overlay on site images (same asset as wander-ne-mobile sites list). */
export function Special50Badge({ className = "", compact = false }) {
  const outer = compact ? "w-7 h-7 bottom-0.5 right-0.5" : "w-9 h-9 bottom-1 right-1";
  const inner = compact ? "w-6 h-6" : "w-8 h-8";
  return (
    <div
      className={`absolute ${outer} rounded-full bg-white/95 p-0.5 flex items-center justify-center shadow-md z-10 ${className}`}
      title="Trail Trek & WanderNebraska Special Site"
    >
      <img
        src={YourParksLogo}
        alt=""
        className={`${inner} object-contain`}
        aria-hidden
      />
    </div>
  );
}
