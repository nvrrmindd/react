import { useQuery } from '@tanstack/react-query'
import { getExchangeRates } from '../services/service'

const ONE_HOUR = 60 * 60 * 1000

// Exchange rates change once a day, so they stay fresh for a whole hour
export default function useExchangeRates() {
  const { data, error, isPending } = useQuery({
    queryKey: ['rates', 'USD'],
    queryFn: ({ signal }) => getExchangeRates(signal),
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR,
  })

  return { data, error: error?.message, loading: isPending }
}
