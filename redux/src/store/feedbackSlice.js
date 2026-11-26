import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createFeedback as createFeedbackApi, getFeedback } from '../services/service'

export const fetchFeedback = createAsyncThunk('feedback/fetchFeedback', () => getFeedback(), {
  condition: (_, { getState }) => getState().feedback.status === 'idle' || getState().feedback.status === 'failed',
})

export const createFeedback = createAsyncThunk('feedback/createFeedback', (data) => createFeedbackApi(data))

const initialState = { items: [], status: 'idle', error: null }

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
  },
})

export default feedbackSlice.reducer
