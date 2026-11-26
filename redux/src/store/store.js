import { configureStore } from '@reduxjs/toolkit'
import jobsReducer from './jobsSlice'
import jobDetailsReducer from './jobDetailsSlice'
import feedbackReducer from './feedbackSlice'

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    jobDetails: jobDetailsReducer,
    feedback: feedbackReducer,
  },
})
