import { useCallback, useEffect, useState } from "react";
import { getMatches } from "../api/fixturesAPI";

function normalizeFixtures(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

export default function useFixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFixtures = useCallback(async (isMountedCheck = () => true) => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches();

      if (isMountedCheck()) {
        setFixtures(normalizeFixtures(data));
      }

    } catch (err) {
      console.error("useFixtures error:", err);

      let message = "Unable to fetch matches.";

      if (err.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err.message) {
        message = err.message;
      }

      if (isMountedCheck()) {
        setError(message);
      }
    } finally {
      if (isMountedCheck()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchFixtures(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [fetchFixtures]);

  return { fixtures, loading, error, refetch: () => fetchFixtures() };
}
