import { useQuery } from "@tanstack/react-query";
import { getFranchises } from "../api/franchiseAPI";

export default function useAllFranchises() {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["franchises", "all"],
    queryFn: async () => {
      const collectedFranchises = [];
      let currentPage = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const payload = await getFranchises(currentPage);

        if (Array.isArray(payload)) {
          return payload;
        }

        const currentBatch = Array.isArray(payload?.results) ? payload.results : [];
        collectedFranchises.push(...currentBatch);

        if (!payload?.next || currentBatch.length === 0) {
          hasNextPage = false;
        } else {
          currentPage += 1;
        }
      }

      return collectedFranchises;
    },
  });

  return {
    franchises: data,
    loading: isLoading,
    error: error?.response?.data?.detail || error?.message || "",
    refetch,
  };
}
