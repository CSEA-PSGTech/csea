import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useBlogs } from "./useBlogs";

/**
 * BlogsListPage — served at /blogs
 *
 * Fetches all blogs from GET /api/blogs and renders them as a card grid,
 * each linking to /blogs/:id for the full post.
 *
 * NOTE: uses plain <a href> rather than a router <Link>. If this page is
 * mounted inside the same SPA via React Router, swap the <a> tags below
 * for <Link to={...}> — everything else stays the same.
 */
export function BlogsListPage() {
  const { blogs, loading, error } = useBlogs();

  return (
    <section className="relative w-full min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-8 md:px-[10%] bg-white">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#5258FF] lg:text-base">
            Blogs
          </p>
          <h1 className="mt-3 sm:mt-4 text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.02] sm:leading-[0.95] tracking-[-0.055em] text-neutral-900">
            Hear from CSEA.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-[1.5] tracking-[-0.01em] text-black/60 lg:text-xl">
            Notes, write-ups, and reflections from the community.
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Loading blogs…
          </div>
        )}

        {!loading && error && (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-red-500">Couldn't load blogs.</p>
            <p className="max-w-sm text-xs text-neutral-400">{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            No blogs published yet.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog, i) => (
              <motion.a
                key={blog.id}
                href={`/blogs/${blog.id}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="group flex flex-col rounded-[20px] overflow-hidden bg-neutral-50 border border-black/5 hover:border-[#5258FF]/20 hover:shadow-lg transition-all duration-300"
              >
                {blog.preview ? (
                  <div className="w-full overflow-hidden bg-neutral-100">
                    <img
                      src={blog.preview}
                      alt={blog.title}
                      className="w-full h-full object-cover aspect-[16/10] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/10] bg-neutral-100" aria-hidden="true" />
                )}

                <div className="flex-1 flex flex-col p-5 sm:p-6">
                  {(blog.date || blog.author) && (
                    <p className="text-[11px] sm:text-xs text-neutral-400 font-medium tracking-wide mb-2">
                      {[blog.date, blog.author].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 tracking-tight leading-snug line-clamp-2">
                    {blog.title}
                  </h2>

                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#5258FF]">
                    Read more
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogsListPage;