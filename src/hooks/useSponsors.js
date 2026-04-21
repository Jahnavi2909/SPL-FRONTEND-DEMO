import { useEffect, useState } from "react";
import { getSponsors } from "../api/sponsorsAPI";

export default function useSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSponsors();

      if (Array.isArray(data)) {
        setSponsors(data);
      } else if (Array.isArray(data?.results)) {
        setSponsors(data.results);
      } else {
        setSponsors([]);
      }
    } catch (err) {
      console.error("Sponsors fetch error:", err);
      setError("Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return { sponsors, loading, error, refetch: fetchSponsors };
}
