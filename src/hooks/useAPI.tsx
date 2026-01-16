/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

type APIResponse<T> = {
  data: T;
  loading: boolean;
  error: any;
  refetch: () => void;
};

export default function useAPI<T>(
  url: string,
  multiple: boolean = true
): APIResponse<T> {
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await api.get(url);
      return res.data;
    },
  });

  let data = multiple ? ([] as T) : (null as unknown as T);
  if (queryData) {
    data = queryData as T;
  }

  return { data, loading: isLoading, error, refetch };
}
