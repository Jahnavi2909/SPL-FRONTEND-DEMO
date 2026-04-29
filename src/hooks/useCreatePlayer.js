import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "../api/playerAPI";

export default function useCreatePlayer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  return {
    createPlayerItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.response?.data || "",
  };
}