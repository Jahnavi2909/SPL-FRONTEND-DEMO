import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncementApi } from "../api/announcementsAPI";

export default function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAnnouncementApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
    },
    onError: (err) => {
      console.error("Create announcement failed:", err);
    },
  });

  return {
    createAnnouncementItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.response?.data?.detail || mutation.error?.message || "",
  };
}
