import YourParksLogo from "../Images/your-parks-adventure-logo.png";

/** Matches wander-ne-mobile: Firebase may store boolean true or string "TRUE". */
export function isSpecial50Site(site) {
  if (!site) return false;
  return site.special50 === true || site.special50 === "TRUE";
}

/** Badge overlay on site images (Your Parks mark for Trail Trek special sites). */
export function Special50Badge({ className = "", compact = false }) {
  const outer = compact
    ? "bottom-0.5 right-0.5 p-0.5 min-h-[24px] min-w-[24px]"
    : "bottom-1 right-1 p-1 min-h-[32px] min-w-[32px]";
  const logoSize = compact ? "w-4 h-4" : "w-6 h-6";
  return (
    <div
      className={`absolute ${outer} rounded-full bg-white/95 flex flex-row items-center justify-center shadow-md z-10 ${className}`}
      title="Trail Trek & WanderNebraska Special Site"
    >
      <img
        src={YourParksLogo}
        alt=""
        className={`${logoSize} object-contain`}
        aria-hidden
      />
    </div>
  );
}
