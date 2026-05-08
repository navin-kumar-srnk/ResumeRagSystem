import { getStats } from '@/src/service/genService';
import { useQuery } from '@tanstack/react-query';

export interface StatsResponse {
  files_indexed: string[];
  total_chunks: number;
}

export function useStats() {
  return useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: true, 
  });
}