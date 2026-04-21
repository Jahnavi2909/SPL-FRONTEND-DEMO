import { useEffect, useState, useCallback } from "react";
import { getNews } from "../api/newsAPI";

export default function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getNews();
      if (Array.isArray(data)) {
        setNews(data);
      } else if (Array.isArray(data?.results)) {
        setNews(data.results);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
}
