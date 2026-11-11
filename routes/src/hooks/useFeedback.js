import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFeedback, getFeedback } from '../services/service'

export function useFeedback() {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: ({ signal }) => getFeedback(signal),
  })
}

// A new review changes the list -> invalidate it so it is loaded again
export function useCreateFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feedback'] }),
  })
}
