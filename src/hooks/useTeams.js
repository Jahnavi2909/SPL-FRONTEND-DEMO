import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/teamAPI";

export default function useTeams() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    teams: Array.isArray(data) ? data : data?.results || [],
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
