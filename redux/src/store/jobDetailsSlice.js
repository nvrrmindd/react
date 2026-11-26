import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { applyToJob as applyToJobApi, getJob } from '../services/service'
import { logAction } from '../services/logs'

export const fetchJob = createAsyncThunk(
  'jobDetails/fetchJob',
  (id, { signal }) => getJob(id, signal),
  {
    condition: (id, { getState }) => {
      const details = getState().jobDetails
      return !(details.job?.id === id && details.status === 'succeeded')
    },
  },
)

export const applyToJob = createAsyncThunk('jobDetails/applyToJob', async (id) => {
  await applyToJobApi(id)
  logAction('apply', { jobId: id })
  return id
})

const initialState = { job: null, status: 'idle', error: null, requestId: null }

const jobDetailsSlice = createSlice({
  name: 'jobDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJob.pending, (state, action) => {
        state.job = null
        state.status = 'loading'
        state.error = null
        state.requestId = action.meta.requestId
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return
        state.status = 'succeeded'
        state.job = action.payload
      })
      .addCase(fetchJob.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        if (state.job?.id === action.payload) state.job.applied = true
      })
  },
})

export default jobDetailsSlice.reducer
