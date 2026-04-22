import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function usePlaces() {
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("place_aggregates").select("*");
    if (error) {
      setError(error.message);
    } else {
      setPlaces(
        (data ?? [])
          .filter((x) => x.lat != null && x.lng != null)
          .map((x) => ({
            ...x,
            coords: [Number(x.lng), Number(x.lat)],
            avg_overall: x.avg_overall != null ? Number(x.avg_overall) : null,
          }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { places, loading, error, reload: load };
}
