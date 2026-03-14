import { QueryClient } from '@tanstack/react-query'

const STALE_TIME = 90 * 1000 // 1.5 мин — данные считаются свежими, без фонового refetch
const CACHE_TIME = 5 * 60 * 1000 // 5 мин — сколько хранить неиспользуемый кэш

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
