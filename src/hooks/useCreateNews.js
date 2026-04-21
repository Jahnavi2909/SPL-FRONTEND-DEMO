import { useState } from "react";
import { createNews } from "../api/newsAPI";

export default function useCreateNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createNewsItem = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const data = await createNews(payload);
      return data;
    } catch (err) {
      console.error("Create news error:", err.response?.data);

      setError(
        err.response?.data?.detail ||
        "Failed to create news"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewsItem,
    loading,
    error,
  };
}