import { useQuery } from "@tanstack/react-query";
import { getPlayers, getTeamPlayerDetails } from "../api/playerAPI";

export default function usePlayers() {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  return {
    players: Array.isArray(data) ? data : data?.results || [],
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}



export function useTeamPlayerDetails(playerId) {
  const { data = {}, isLoading, error, refetch } = useQuery({
    queryKey: ["player"],
    queryFn: ()  => getTeamPlayerDetails(playerId),
  });

  return {
    player: data, 
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
