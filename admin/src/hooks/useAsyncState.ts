import { useCallback, useState } from "react";

export function useAsyncState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const next = await fn();
      setState(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, setState, loading, error, run };
}
