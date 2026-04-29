import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSponsor } from "../api/sponsorsAPI";

export default function useCreateSponsor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSponsor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sponsors"] });
      await queryClient.invalidateQueries({ queryKey: ["adminRecentActivities"] });
    },
    onError: (err) => {
      console.error("Create sponsor error:", err.response?.data);
    },
  });

  return {
    createSponsorItem: mutation.mutateAsync,
  };
}
