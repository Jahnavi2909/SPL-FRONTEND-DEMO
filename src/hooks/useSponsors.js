import { useQuery } from "@tanstack/react-query";
import { getSponsors } from "../api/sponsorsAPI";

export default function useSponsors() {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const payload = await getSponsors();

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.results)) {
        return payload.results;
      }

      return [];
    },
  });

  return {
    sponsors: data,
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
