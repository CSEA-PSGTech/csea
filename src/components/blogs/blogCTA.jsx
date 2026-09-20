import { ArrowUpRight } from "lucide-react";

/**
 * BlogCTA
 * Standalone call-to-action section linking out to the CSEA blogs page.
 *
 * Blogs are served as a separate page/app, not part of this SPA's routes:
 *   - csea.psgtech.ac.in/blogs         -> all blogs
 *   - csea.psgtech.ac.in/blogs/blog1   -> a single blog post
 *
 * Because of that, this uses a plain <a href="/blogs"> (full page
 * navigation) rather than a client-side router Link. If /blogs is later
 * folded into this same React app with React Router, swap the <a> for a
 * <Link to="/blogs"> — the rest of the markup/styling can stay as-is.
 */
export function BlogCTA({
  href = "/blogs",
  label = "View Our Blogs",
  className = "",
}) {
  return (
    <section
      className={
        "w-full py-12 sm:py-28 px-4 sm:px-8 flex items-center justify-center bg-transparent " +
        className
      }
    >
      <a
        href={href}
        className="group relative inline-flex items-center gap-2.5 sm:gap-4 px-6 sm:px-12 py-3.5 sm:py-7 rounded-full bg-[#EEF1FF] hover:bg-[#5258FF] text-[#5258FF] hover:text-white border border-[#5258FF]/15 transition-colors duration-300 shadow-md sm:shadow-lg"
      >
        <span className="text-base sm:text-2xl md:text-3xl font-semibold tracking-[-0.02em] uppercase">
          {label}
        </span>
        <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    </section>
  );
}

export default BlogCTA;