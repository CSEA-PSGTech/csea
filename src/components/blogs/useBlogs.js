import { useState, useEffect, useCallback } from "react";


export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/api/blogs`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { blogs, loading, error, refetch: load };
}

/**
 * useBlogPost
 * Fetches a single blog post from GET /api/blogs/:id.
 *
 * Expected response shape: { blog: {...} }
 * `blog.content` is HTML (fetched server-side from the linked Google
 * Doc's export) — not markdown or plain text — so it's rendered with
 * dangerouslySetInnerHTML on the frontend. See BlogPostPage.jsx.
 */
export function useBlogPost(id) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) {
      setBlog(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/api/blogs/${encodeURIComponent(id)}`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setBlog(data.blog || null);
    } catch (err) {
      setError(err.message || "Failed to load blog post.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { blog, loading, error, refetch: load };
}