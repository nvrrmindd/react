import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeedback } from '../store/feedbackSlice'
import { selectFeedback, selectFeedbackSummary } from '../store/selectors'

export default function useFeedback() {
  const dispatch = useDispatch()
  const feedback = useSelector(selectFeedback)
  const summary = useSelector(selectFeedbackSummary)

  useEffect(() => {
    dispatch(fetchFeedback())
  }, [dispatch])

  return { ...feedback, summary, refetch: () => dispatch(fetchFeedback()) }
}
