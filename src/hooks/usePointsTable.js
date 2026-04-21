import { useQuery } from "@tanstack/react-query";
import { getPointsTable } from "../api/pointsTableAPI";

function getErrorMessage(error) {
  if (typeof error?.response?.data?.detail === "string") {
    return error.response.data.detail;
  }

  if (typeof error?.response?.data?.message === "string") {
    return error.response.data.message;
  }

  return error?.message || "";
}

export default function usePointsTable() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["points-table"],
    queryFn: getPointsTable,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  const pointsTable = Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data)
      ? data
      : [];

  return {
    pointsTable,
    count: Number(data?.count) || pointsTable.length,
    loading: isLoading,
    error: getErrorMessage(error),
    refetch,
  };
}
