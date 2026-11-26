import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applyToJob, createJob, getAllJobs, getJob, getJobs } from '../services/service'
import { logAction } from '../services/logs'

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

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJob,
    onSuccess: (job) => {
      logAction('create_job', { jobId: job.id, title: job.title })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useApplyToJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (_, jobId) => {
      logAction('apply', { jobId })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
