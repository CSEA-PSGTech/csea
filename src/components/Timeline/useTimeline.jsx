import { useState, useEffect, useCallback } from "react";

/**
 * useTimeline
 * Fetches the timeline entries from GET /api/timeline (sheet-backed,
 * same pattern as useSheetEvents in EventsSection.jsx).
 *
 * Expected response shape: { timeline: [...] }
 * Each entry: { id, rowIndex, title, date, description, preview }
 *
 * Entries come back in sheet order (already chronological in the
 * source data) — this hook does not re-sort, since `date` is
 * free-text ("17 - 21 August 2026") and not reliably parseable.
 */
export function useTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/api/timeline`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setTimeline(data.timeline || []);
    } catch (err) {
      setError(err.message || "Failed to load timeline.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { timeline, loading, error, refetch: load };
}