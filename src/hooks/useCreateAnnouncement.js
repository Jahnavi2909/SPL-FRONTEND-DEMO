import { useState } from "react";
import { createAnnouncementApi } from "../api/announcementsAPI";

export default function useCreateAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAnnouncementItem = async (payload) => {
    try {
      setLoading(true);
      setError("");

      const data = await createAnnouncementApi(payload);
      return data;
    } catch (err) {
      console.error("Create announcement failed:", err);
      setError(err.response?.data?.detail || "Create failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAnnouncementItem, loading, error };
}