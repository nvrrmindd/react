import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applyToJob, createJob, getAllJobs, getJob, getJobs } from '../services/service'

// All query keys start with 'jobs', so invalidating ['jobs'] refreshes all of them.

// One page of the list. filters = search, level, aiRisk, remoteOnly, sort, page, pageSize
export function useJobs(filters) {
  return useQuery({
    queryKey: ['jobs', 'list', filters],
    queryFn: ({ signal }) => getJobs(filters, signal),
  })
}

export function useAllJobs() {
  return useQuery({
    queryKey: ['jobs', 'all'],
    queryFn: ({ signal }) => getAllJobs(signal),
  })
}

export function useJob(id, enabled) {
  return useQuery({
    queryKey: ['jobs', 'detail', id],
    queryFn: ({ signal }) => getJob(id, signal),
    enabled,
  })
}

// After a change, all cached jobs data is old -> invalidate ['jobs']
export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

export function useApplyToJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })
}
