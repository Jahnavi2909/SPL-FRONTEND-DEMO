import { useQuery } from "@tanstack/react-query";
import { getVenues } from "../api/venuesAPI";

export default function useVenues() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });

  return {
    venues: Array.isArray(data) ? data : data?.results || [],
    loading: isLoading,
    error: error?.response?.data?.detail || error?.message || "",
    refetch,
  };
}    
