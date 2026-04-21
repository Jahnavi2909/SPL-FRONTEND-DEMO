import { useQuery } from "@tanstack/react-query";
import { getAdminRecentActivities } from "../api/adminDashboardAPI";

export default function useAdminRecentActivities() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminRecentActivities"],
    queryFn: getAdminRecentActivities,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    recentActivities: Array.isArray(data) ? data : [],
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
