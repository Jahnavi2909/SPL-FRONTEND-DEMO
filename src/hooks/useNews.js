import { useQuery } from "@tanstack/react-query";
import { getNews } from "../api/newsAPI";

export default function useNews() {
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const payload = await getNews();

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
    news: data,
    loading: isLoading,
    error: error?.message || "",
    refetch,
  };
}
