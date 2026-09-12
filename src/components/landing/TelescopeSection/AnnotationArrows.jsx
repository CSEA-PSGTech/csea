import React from "react";

export function ArrowDownRight({ className = "", width = 34, height = 24 }) {
  return (
    <svg
      viewBox="0 0 34 24"
      width={width}
      height={height}
      className={`annotation-arrow ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 3 3 C 14 4, 25 10, 28 19"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 20 17 L 28 19 L 29 11"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownLeft({ className = "", width = 34, height = 24 }) {
  return (
    <svg
      viewBox="0 0 34 24"
      width={width}
      height={height}
      className={`annotation-arrow ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 31 3 C 20 4, 9 10, 6 19"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 14 17 L 6 19 L 5 11"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ className = "", width = 34, height = 24 }) {
  return (
    <svg
      viewBox="0 0 34 24"
      width={width}
      height={height}
      className={`annotation-arrow ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 3 21 C 14 20, 25 14, 28 5"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 20 7 L 28 5 L 29 13"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpLeft({ className = "", width = 34, height = 24 }) {
  return (
    <svg
      viewBox="0 0 34 24"
      width={width}
      height={height}
      className={`annotation-arrow ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 31 21 C 20 20, 9 14, 6 5"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 14 7 L 6 5 L 5 13"
        stroke="#2563eb"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandDrawnUnderline({ className = "", width = 64, height = 8 }) {
  return (
    <svg
      viewBox="0 0 64 8"
      width={width}
      height={height}
      className={`annotation-underline ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 2 4 Q 32 1.5, 62 5"
        stroke="#2563eb"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
