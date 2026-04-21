import { useCallback, useEffect, useState } from "react";
import { getFranchises } from "../api/franchiseAPI";

export default function useAllFranchises() {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllFranchises = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const collectedFranchises = [];
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const data = await getFranchises(currentPage);

        if (Array.isArray(data)) {
          setFranchises(data);
          setLoading(false);
          return;
        }

        const currentBatch = Array.isArray(data?.results) ? data.results : [];
        collectedFranchises.push(...currentBatch);

        if (!data?.next || currentBatch.length === 0) {
          hasNextPage = false;
        } else {
          currentPage += 1;
        }
      }

      setFranchises(collectedFranchises);
    } catch (err) {
      console.error("useAllFranchises error:", err);

      if (err.code === "ERR_NETWORK") {
        setError("Backend server is not reachable.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Unable to fetch franchises.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFranchises = async () => {
      if (!isMounted) {
        return;
      }

      await fetchAllFranchises();
    };

    loadFranchises();

    return () => {
      isMounted = false;
    };
  }, [fetchAllFranchises]);

  return {
    franchises,
    loading,
    error,
    refetch: fetchAllFranchises,
  };
}
