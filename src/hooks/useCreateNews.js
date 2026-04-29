import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../api/newsAPI";

export default function useCreateNews() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNews,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["news"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
    },
    onError: (err) => {
      console.error("Create news error:", err.response?.data);
    },
  });

  const errorMessage = mutation.error
    ? mutation.error?.response?.data?.detail ||
      mutation.error?.message ||
      "Failed to create news"
    : "";

  return {
    createNewsItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: errorMessage,
    resetError: mutation.reset,
  };
}
