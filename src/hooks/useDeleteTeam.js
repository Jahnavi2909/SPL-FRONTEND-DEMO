import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "../api/teamAPI";

export default function useDeleteTeam() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  return {
    deleteTeamItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.response?.data || "",
  };
}
