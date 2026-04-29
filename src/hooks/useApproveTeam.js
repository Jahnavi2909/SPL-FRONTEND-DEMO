import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveTeam } from "../api/teamAPI";

export default function useApproveTeam() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: approveTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  return {
    approveTeamItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.response?.data || "",
  };
}
