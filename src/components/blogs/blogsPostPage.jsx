import { ArrowLeft } from "lucide-react";
import { useBlogPost } from "./useBlogs";

/**
 * BlogPostPage — served at /blogs/:id
 *
 * NOTE on getting the id: this component expects the route param as a
 * prop (`id`). Wire it up depending on your router:
 *
 *   React Router v6:
 *     import { useParams } from "react-router-dom";
 *     function BlogPostRoute() {
 *       const { id } = useParams();
 *       return <BlogPostPage id={id} />;
 *     }
 *
 *   Or, if /blogs/:id is served by a completely separate
 *   app/deployment (not this SPA), pull `id` from
 *   window.location.pathname instead.
 *
 * `blog.content` arrives as HTML (the linked Google Doc's export),
 * fetched server-side by GET /api/blogs/:id — rendered below with
 * dangerouslySetInnerHTML. Since this HTML comes from your own backend
 * (which only fetches from Docs your team controls, shared with your
 * own service account), it's a trusted source, not arbitrary user
 * input — but if the Blogs sheet / Docs access ever becomes
 * publicly-writable, revisit sanitizing this before rendering.
 */
export function BlogPostPage({ id }) {
  const { blog, loading, error } = useBlogPost(id);

  return (
    <section className="relative w-full min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-5 sm:px-8 bg-white">
      <div className="w-full max-w-3xl mx-auto">
        <a
          href="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 text-xs sm:text-sm font-medium transition-all border border-black/5 mb-8 sm:mb-12"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>All blogs</span>
        </a>

        {loading && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Loading blog…
          </div>
        )}

        {!loading && error && (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-red-500">Couldn't load this blog post.</p>
            <p className="max-w-sm text-xs text-neutral-400">{error}</p>
          </div>
        )}

        {!loading && !error && !blog && (
          <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
            Blog post not found.
          </div>
        )}

        {!loading && !error && blog && (
          <article>
            {(blog.date || blog.author || blog.yearAndClass) && (
              <p className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide mb-3">
                {[blog.date, blog.author, blog.yearAndClass].filter(Boolean).join(" · ")}
              </p>
            )}

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.05] mb-6 sm:mb-8">
              {blog.title}
            </h1>

            {blog.preview && (
              <img
                src={blog.preview}
                alt={blog.title}
                className="w-full aspect-video object-cover rounded-2xl mb-8 sm:mb-10"
              />
            )}

            {/* Body content — HTML fetched server-side from the linked
                Google Doc, see the note above */}
            <div
              className="prose prose-neutral max-w-none text-base sm:text-lg leading-relaxed text-neutral-700"
              dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || "" }}
            />

            {blog.yearAndClass && (
              <div className="mt-10">
                <span className="text-xs font-medium uppercase tracking-wide text-[#5258FF] bg-[#EEF1FF] border border-[#5258FF]/15 px-3 py-1 rounded-full">
                  {blog.yearAndClass}
                </span>
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

export default BlogPostPage;