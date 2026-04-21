import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "../api/teamAPI";
 
export default function useCreateTeam() {
  const queryClient = useQueryClient();
 
  const mutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
 
  return {
    createTeamItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.response?.data || "",
  };
}
 