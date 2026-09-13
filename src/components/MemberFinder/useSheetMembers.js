import { useState, useEffect, useCallback } from "react";


export function useSheetMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${base}/api/members`);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Request failed (status ${res.status})`);
      }

      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      setError(err.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { members, loading, error, refetch: load };
}
