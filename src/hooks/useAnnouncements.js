import { useEffect, useState, useCallback } from "react";
import { fetchAnnouncementsApi } from "../api/announcementsAPI";

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchAnnouncementsApi();
      const announcementList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

      const now = new Date();

      const activeAnnouncements = announcementList.filter(
        (item) =>
          !item.expires_at || new Date(item.expires_at) > now
      );

      setAnnouncements(activeAnnouncements);
    } catch (err) {
      setError(err.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements, loading, error, refetch: fetchAnnouncements };
}
