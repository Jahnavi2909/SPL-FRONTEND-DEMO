import { useQuery } from "@tanstack/react-query";
import getFranchiseDashboard from "../api/franchiseDashboardApi";


export default function useFranchiseDashboard(franchiseId) {
  const { data = {}, isLoading, error, refetch } = useQuery({
    queryKey: ["franchise-dashboard", franchiseId],
    queryFn: () => getFranchiseDashboard(franchiseId),
    enabled: !!franchiseId,
  });

  return {
    data:  data, 
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}