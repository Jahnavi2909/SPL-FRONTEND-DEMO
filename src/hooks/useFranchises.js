import { useQuery } from "@tanstack/react-query";
import { getFranchiseById, getFranchises } from "../api/franchiseAPI";

export default function useFranchises(page = 1) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["franchises", "page", page],
    queryFn: () => getFranchises(page),
  });

  const payload = data || {};
  const franchises = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : [];

  return {
    franchises,
    loading: isLoading,
    error: error?.response?.data?.detail || error?.message || "",
    next: Array.isArray(payload) ? null : payload?.next || null,
    previous: Array.isArray(payload) ? null : payload?.previous || null,
    count: Array.isArray(payload) ? payload.length : Number(payload?.count) || 0,
    refetch,
  };
}

