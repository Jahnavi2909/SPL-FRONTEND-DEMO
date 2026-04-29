import { useQuery } from "@tanstack/react-query";
import { getTeamPlayers } from "../api/teamAPI";

export default function useTeamPlayers(teamId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["teamPlayers", String(teamId || "")],
    queryFn: () => getTeamPlayers(teamId),
    enabled: Boolean(teamId),
  });

  return {
    players: Array.isArray(data) ? data : data?.results || [],
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
