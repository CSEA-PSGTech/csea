import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton
 * Sends the user back to the home page ("/") via React Router,
 * so there's no full page reload.
 */
export function BackButton({ to = "/", label = "Back to Home", className = "" }) {
  return (
    <Link
      to={to}
      className={
        "group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full " +
        "bg-[#EEF1FF] hover:bg-[#5258FF] text-[#5258FF] hover:text-white " +
        "border border-[#5258FF]/15 shadow-md transition-colors duration-300 " +
        className
      }
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="text-sm sm:text-base font-semibold tracking-[-0.02em] uppercase">
        {label}
      </span>
    </Link>
  );
}

export default BackButton;