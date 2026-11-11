import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applyToJob, createJob, getAllJobs, getJob, getJobs } from '../services/service'

// Query keys. All of them start with 'jobs',
// so invalidating ['jobs'] refreshes every jobs query at once.
//   ['jobs', 'list', filters] - one page of the list for one set of filters
//   ['jobs', 'all']           - all jobs (dashboard)
//   ['jobs', 'detail', id]    - one job

// One page of jobs. filters contains search, level, aiRisk, remoteOnly, sort, page, pageSize.
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

// A new job changes the lists and the dashboard -> invalidate all jobs queries
export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

// Applying changes only one job -> invalidate only this job
export function useApplyToJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (data, id) => queryClient.invalidateQueries({ queryKey: ['jobs', 'detail', id] }),
  })
}
