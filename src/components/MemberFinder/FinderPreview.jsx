import React from "react";
import { X, Mail } from "lucide-react";

export function FinderPreview({ member, onClose }) {
  if (!member) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-transparent animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-[460px] sm:h-[480px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl finder-window-shadow border-none select-none group"
      >
        {/* Full-size Rectangular Background Photo */}
        <img
          src={member.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white backdrop-blur-md transition-all shadow-lg border-none"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Faded Gradient Background Overlay at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
          {/* Badge chip if present */}
          {member.badge && (
            <span className="self-start mb-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-blue-600 text-white shadow-md border-none">
              {member.badge}
            </span>
          )}

          {/* Name in Bold Modern Typography over Faded BG */}
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
            {member.name}
          </h3>

          {/* Role in Clean Accent Typography */}
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-300 uppercase mt-1 drop-shadow-xs">
            {member.role || "CSEA Member"}
          </p>

          {/* Social Links if present */}
          {(member.github || member.linkedin || member.email) && (
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-3">
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors border-none"
                  title="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors border-none"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors border-none"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
