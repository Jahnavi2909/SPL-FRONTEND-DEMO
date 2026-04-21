import { useEffect, useState } from "react";
import { getFranchises } from "../api/franchiseAPI";

export default function useFranchises(page = 1) {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchFranchises() {
      try {
        setLoading(true);
        setError("");

        const data = await getFranchises(page);

        if (isMounted) {
          setFranchises(Array.isArray(data?.results) ? data?.results : []);
          setNext(data?.next || null);
          setPrevious(data?.previous);
          setCount(Number(data?.count) || 0);
        }
      } catch (err) {
        console.error("useFranchises error:", err);

        let message = "Unable to fetch franchises.";

        if (err.code === "ERR_NETWORK") {
          message = "Backend server is not reachable.";
        } else if (err.response?.data?.detail) {
          message = err.response.data.detail;
        } else if (err.message) {
          message = err.message;
        }

        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFranchises();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return { franchises, loading, error, next, previous, count };
}
