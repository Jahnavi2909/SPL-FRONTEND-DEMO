import { useQuery } from "@tanstack/react-query";
import { getFranchiseTeams, getTeamDetails, getTeams } from "../api/teamAPI";

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


export function useFranchiseTeams(franchiseId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["franchise teams", franchiseId],
    queryFn: () => getFranchiseTeams(franchiseId),
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



export function useTeamDetail(teamId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamDetails(teamId),
     enabled: !!teamId,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    team: data,
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}