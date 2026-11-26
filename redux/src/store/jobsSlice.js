import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createJob as createJobApi, getAllJobs, getJobs } from '../services/service'
import { logAction } from '../services/logs'

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  (filters, { signal }) => getJobs(filters, signal),
  {
    condition: (filters, { getState }) => {
      const { list } = getState().jobs
      return !(list.key === JSON.stringify(filters) && list.status === 'succeeded')
    },
  },
)

export const fetchAllJobs = createAsyncThunk(
  'jobs/fetchAllJobs',
  (_, { signal }) => getAllJobs(signal),
  {
    condition: (_, { getState }) => getState().jobs.all.status !== 'succeeded',
  },
)

export const createJob = createAsyncThunk('jobs/createJob', async (data) => {
  const job = await createJobApi(data)
  logAction('create_job', { jobId: job.id, title: job.title })
  return job
})

const initialState = {
  list: { items: [], total: 0, key: null, status: 'idle', error: null, requestId: null },
  all: { items: [], status: 'idle', error: null, requestId: null },
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.key = JSON.stringify(action.meta.arg)
        state.list.requestId = action.meta.requestId
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.list.requestId) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.items
        state.list.total = action.payload.total
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        if (action.meta.requestId !== state.list.requestId) return
        state.list.status = 'failed'
        state.list.error = action.error.message
      })
      .addCase(fetchAllJobs.pending, (state, action) => {
        state.all.status = 'loading'
        state.all.error = null
        state.all.requestId = action.meta.requestId
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.all.requestId) return
        state.all.status = 'succeeded'
        state.all.items = action.payload
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        if (action.meta.requestId !== state.all.requestId) return
        state.all.status = 'failed'
        state.all.error = action.error.message
      })
      .addCase(createJob.fulfilled, (state) => {
        state.list.key = null
        state.all.status = 'idle'
      })
  },
})

export default jobsSlice.reducer
