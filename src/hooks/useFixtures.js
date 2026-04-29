import { useQuery } from "@tanstack/react-query";
import { getMatchDetails, getMatches } from "../api/fixturesAPI";

function normalizeFixtures(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

export default function useFixtures() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fixtures"],
    queryFn: getMatches,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    fixtures: normalizeFixtures(data),
    loading: isLoading,
    error: error?.response?.data?.detail || error?.message || "",
    refetch,
  };
}



export function useMatchDetails(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fixtures", id],
    queryFn: () => getMatchDetails(id),
    enabled: Boolean(id),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    match: data || null,
    loading: isLoading,
    error: error?.response?.data?.detail || error?.message || "",
    refetch,
  };
}
