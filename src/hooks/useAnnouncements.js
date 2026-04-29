import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncementsApi } from "../api/announcementsAPI";

export default function useAnnouncements() {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const payload = await fetchAnnouncementsApi();
      const announcementList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
          ? payload.results
          : [];
      const now = new Date();

      return announcementList.filter(
        (item) => !item.expires_at || new Date(item.expires_at) > now
      );
    },
  });

  return {
    announcements: data,
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
