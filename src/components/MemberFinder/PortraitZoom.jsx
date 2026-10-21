import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FinderPreview } from "./FinderPreview";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

// Google Drive share links don't render in <img>; convert them to a direct image URL.
export function resolvePhoto(url) {
  if (!url) return "";
  if (url.startsWith("/api/")) return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
  if (!url.includes("drive.google.com")) return url;
  const match = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}=s800` : url;
}

export function initials(name = "") {
  return name
    .replace(/^(shri|smt|dr|mr|mrs|ms|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Round photo (or initials if there's no photo / it fails to load). Fills its parent.
//  - scale-[1.12] crops off white margins that some uploaded photos have baked in
//  - the crop favours the upper part of the photo, so faces stay in frame on full-length shots
//  - the <img> is absolutely positioned so a tall/wide photo can never stretch the circle
//  - the inset hairline marks exactly where the photo starts, so the white frame
//    reads the same width on every photo, light or dark background
export function PortraitPhoto({ person, imgClassName = "", initialsClassName = "text-4xl" }) {
  const [failed, setFailed] = useState(false);
  const src = resolvePhoto(person.photo);

  return (
    <span className="relative block h-full w-full overflow-hidden rounded-full bg-neutral-100">
      {src && !failed ? (
        <img
          src={src}
          alt={person.name}
          loading="lazy"
          draggable={false}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`absolute inset-0 block h-full w-full max-w-none scale-[1.12] object-cover object-[50%_20%] ${imgClassName}`}
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center font-medium tracking-[-0.03em] text-neutral-400 ${initialsClassName}`}
        >
          {initials(person.name)}
        </span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Thumbnail — round photo; click opens the member card              */
/* ------------------------------------------------------------------ */
export function ZoomThumb({ person, onSelect, className = "", initialsClassName }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      aria-label={`View ${person.name}${person.position ? `, ${person.position}` : ""}`}
      className={`group relative block w-full aspect-square shrink-0 overflow-visible rounded-full cursor-zoom-in
        transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]
        focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20 ${className}`}
    >
      <span
        className="block h-full w-full rounded-full bg-white p-[5px] ring-1 ring-black/15 transition-shadow duration-500
          shadow-[0_14px_32px_-24px_rgba(0,0,0,0.35)] group-hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)]"
      >
        <PortraitPhoto
          person={person}
          initialsClassName={initialsClassName}
          imgClassName="grayscale-[25%] transition duration-500 group-hover:grayscale-0"
        />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Member card — the same "Meet the Team" card the Directory opens    */
/* ------------------------------------------------------------------ */
export function MemberCardModal({ person, onClose }) {
  // Freeze page scroll (ScrollSmoother on desktop, body on mobile) while the card is open.
  useEffect(() => {
    const smoother = window.__scrollSmoother;
    smoother?.paused?.(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      smoother?.paused?.(false);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (typeof document === "undefined" || !person) return null;

  // Portaled to <body> so it isn't trapped inside ScrollSmoother's transformed content.
  return createPortal(
    <FinderPreview member={person} onClose={onClose} isPortaled />,
    document.body
  );
}