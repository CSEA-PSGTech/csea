import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { EVENTS_DATA } from "../events/eventsData";

function GalleryItem(props) {
  var item = props.item;
  var isActive = props.isActive;
  var onActivate = props.onActivate;
  var onOpenModal = props.onOpenModal;

  var cardWidthClass = isActive
    ? "w-[72vw] max-w-[280px] sm:max-w-none sm:w-[420px] md:w-[520px] lg:w-[600px] shadow-xl sm:shadow-2xl"
    : "w-[30px] sm:w-[54px] md:w-[64px] opacity-65 hover:opacity-90";

  var cardClass =
    "relative h-[320px] sm:h-[460px] md:h-[500px] rounded-[18px] sm:rounded-[24px] overflow-hidden cursor-pointer shrink-0 transition-[width] ease-[cubic-bezier(0.25,1,0.5,1)] duration-500 select-none " +
    cardWidthClass;

  var gradientClass = isActive
    ? "absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/30 to-black/10"
    : "absolute inset-0 transition-opacity duration-300 bg-black/55 hover:bg-black/40";

  var metaLine = [item.date, item.venue].filter(Boolean).join(" - ");

  return (
    <motion.div layout={true} whileTap={{ scale: 0.99 }} onMouseEnter={onActivate} onClick={onOpenModal} className={cardClass}>
      <motion.img src={item.preview} alt={item.title} layoutId={"event-img-" + item.id} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105" />
      <div className={gradientClass} />
      {isActive ? (
        <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between z-10 text-white">
          <div>
            <span className="inline-block text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 bg-white/15 backdrop-blur-md px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full border border-white/10">
              {item.category}
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-3">
            <p className="text-[10px] sm:text-xs text-white/70 font-medium tracking-wide">{metaLine}</p>
            <h3 className="text-lg sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">{item.title}</h3>
            <p className="text-[11px] sm:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-md font-normal">{item.tagline || item.description}</p>
            <div className="pt-1.5 sm:pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md transition-all border border-white/20">
                View Event
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
          <div className="rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-wider uppercase text-white/75 whitespace-nowrap">{item.title}</div>
        </div>
      )}
    </motion.div>
  );
}

/* Full-size photo lightbox, layered above the detail page */
function PhotoLightbox(props) {
  var photos = props.photos;
  var activeIndex = props.activeIndex;
  var onClose = props.onClose;
  var onNavigate = props.onNavigate;
  var altBase = props.altBase;

  if (activeIndex === null || activeIndex === undefined) {
    return null;
  }

  var hasMultiple = photos.length > 1;

  function goPrev(e) {
    e.stopPropagation();
    var next = activeIndex > 0 ? activeIndex - 1 : photos.length - 1;
    onNavigate(next);
  }

  function goNext(e) {
    e.stopPropagation();
    var next = activeIndex < photos.length - 1 ? activeIndex + 1 : 0;
    onNavigate(next);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[1000000] bg-black/95 flex items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
      >
        <X className="w-5 h-5" />
      </button>

      {hasMultiple ? (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      ) : null}

      <motion.img
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={photos[activeIndex]}
        alt={altBase + " photo " + (activeIndex + 1)}
        onClick={function (e) {
          e.stopPropagation();
        }}
        className="max-w-full max-h-full object-contain rounded-xl"
      />

      {hasMultiple ? (
        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      ) : null}

      {hasMultiple ? (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-white/70">
          {activeIndex + 1} / {photos.length}
        </div>
      ) : null}
    </motion.div>
  );
}

export function EventModal(props) {
  var item = props.item;
  var isOpen = props.isOpen;
  var onClose = props.onClose;

  var lightboxState = useState(null);
  var lightboxIndex = lightboxState[0];
  var setLightboxIndex = lightboxState[1];

  useEffect(
    function () {
      if (!isOpen) {
        setLightboxIndex(null);
      }
    },
    [isOpen]
  );

  useEffect(
    function () {
      if (!isOpen) {
        return undefined;
      }
      function handleKeyDown(e) {
        if (e.key === "Escape") {
          if (lightboxIndex !== null) {
            setLightboxIndex(null);
          } else {
            onClose();
          }
        }
      }
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyDown);
      return function cleanup() {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    },
    [isOpen, onClose, lightboxIndex]
  );

  if (typeof document === "undefined") {
    return null;
  }
  if (!item) {
    return null;
  }

  var statusValue = item.status || "";
  var isCompleted = statusValue.trim().toLowerCase() === "completed";
  var photos = item.photos && item.photos.length ? item.photos : [];
  var hasRealLink = Boolean(item.registrationLink) && item.registrationLink.indexOf("#") !== 0;
  var registrationHref = item.registrationLink || "#";
  var metaLine = [item.date, item.venue].filter(Boolean).join(" - ");

  var linkExtraProps = {};
  if (hasRealLink) {
    linkExtraProps.target = "_blank";
    linkExtraProps.rel = "noopener noreferrer";
  }

  function handleRegisterClick(e) {
    if (!hasRealLink) {
      e.preventDefault();
      var msg = "Registration or details for " + item.title + " will open soon.";
      window.alert(msg);
    }
  }

  function openLightbox(i) {
    setLightboxIndex(i);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function renderPhoto(src, i) {
    return (
      <button
        key={i}
        type="button"
        onClick={function () {
          openLightbox(i);
        }}
        aria-label={"View photo " + (i + 1) + " full size"}
        className="overflow-hidden rounded-2xl bg-neutral-100 cursor-pointer group relative"
      >
        <img
          src={src}
          alt={item.title + " photo " + (i + 1)}
          className="w-full h-full object-cover aspect-video transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </button>
    );
  }

  var modalBody = (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[999999] bg-white overflow-y-auto">
      <button type="button" onClick={onClose} aria-label="Back to events" className="fixed top-5 left-5 sm:top-8 sm:left-8 z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs sm:text-sm font-medium transition-all border border-black/5 shadow-sm">
        <ArrowLeft className="w-4 h-4 stroke-[2]" />
        <span>Back</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ type: "spring", stiffness: 350, damping: 32 }} className="w-full max-w-4xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto text-left flex flex-col items-start">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#5258FF] bg-[#5258FF]/10 px-3 py-1 rounded-full">
            {item.category}
          </span>

          <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.05] text-left">
            {item.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-neutral-500 font-medium text-left">{metaLine}</p>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-neutral-600 whitespace-pre-line text-left">
            {item.description}
          </p>

          {!isCompleted ? (
            <div className="mt-6 sm:mt-8">
              <a href={registrationHref} onClick={handleRegisterClick} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-sm" {...linkExtraProps}>
                <span>Register for Event</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : null}

          {isCompleted && photos.length > 0 ? (
            <div className="mt-10 sm:mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {photos.map(renderPhoto)}
            </div>
          ) : null}
        </div>
      </motion.div>

      <AnimatePresence>
        <PhotoLightbox
          photos={photos}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
          altBase={item.title}
        />
      </AnimatePresence>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{isOpen ? modalBody : null}</AnimatePresence>,
    document.body
  );
}

export function Gallery(props) {
  var items = props.items || EVENTS_DATA;
  var index = props.index || 0;
  var setIndex = props.setIndex;
  var setOpen = props.setOpen;

  var containerRef = useRef(null);

  useEffect(
    function () {
      if (!containerRef.current) {
        return;
      }
      var activeChild = containerRef.current.children[index];
      if (activeChild) {
        activeChild.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    },
    [index]
  );

  function renderItem(item, i) {
    return (
      <GalleryItem
        key={item.id}
        item={item}
        isActive={index === i}
        onActivate={function () {
          setIndex(i);
        }}
        onOpenModal={function () {
          setIndex(i);
          setOpen(true);
        }}
      />
    );
  }

  return (
    <div className="w-full flex items-center justify-start py-2 overflow-hidden">
      <div ref={containerRef} className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar py-4 max-w-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map(renderItem)}
      </div>
    </div>
  );
}

export default function AccordionModal(props) {
  var items = props.items || EVENTS_DATA;
  var index = props.index || 0;
  var setIndex = props.setIndex;
  var open = props.open || false;
  var setOpen = props.setOpen;

  var safeIndex = index < items.length ? index : 0;
  var activeItem = items[safeIndex] || items[0];

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      <Gallery items={items} index={safeIndex} setIndex={setIndex} setOpen={setOpen} />
      <EventModal item={activeItem} isOpen={open} onClose={handleClose} />
    </div>
  );
}