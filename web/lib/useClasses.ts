"use client";

import { useCallback, useEffect, useState } from "react";
import { getClasses } from "./supabase/queries";
import type { GymClass } from "./types";

export function useClasses() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await getClasses();
      setClasses(data);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load classes";
      setError(
        /failed to fetch|networkerror|load failed/i.test(message)
          ? "Couldn't reach the server — check your connection and try again."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount: the lint rule wants setState calls confined
    // to subscription callbacks, but there's no subscription here, just a
    // one-shot load -- fetchClasses' own setState calls only run after
    // `await getClasses()` resolves, not synchronously within this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClasses();
  }, [fetchClasses]);

  const refetch = useCallback(() => {
    setLoading(true);
    return fetchClasses();
  }, [fetchClasses]);

  return { classes, loading, error, refetch };
}
