import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllJobs, fetchJobs } from '../store/jobsSlice'
import { fetchJob } from '../store/jobDetailsSlice'
import { selectAllJobs, selectJobDetails, selectJobsList } from '../store/selectors'

export function useJobs(filters) {
  const dispatch = useDispatch()
  const list = useSelector(selectJobsList)
  const key = JSON.stringify(filters)

  useEffect(() => {
    const request = dispatch(fetchJobs(JSON.parse(key)))
    return () => request.abort()
  }, [dispatch, key])

  return { ...list, refetch: () => dispatch(fetchJobs(JSON.parse(key))) }
}

export function useAllJobs() {
  const dispatch = useDispatch()
  const all = useSelector(selectAllJobs)

  useEffect(() => {
    const request = dispatch(fetchAllJobs())
    return () => request.abort()
  }, [dispatch])

  return { ...all, refetch: () => dispatch(fetchAllJobs()) }
}

export function useJob(id, enabled) {
  const dispatch = useDispatch()
  const details = useSelector(selectJobDetails)

  useEffect(() => {
    if (!enabled) return
    const request = dispatch(fetchJob(id))
    return () => request.abort()
  }, [dispatch, id, enabled])

  return { ...details, refetch: () => dispatch(fetchJob(id)) }
}
