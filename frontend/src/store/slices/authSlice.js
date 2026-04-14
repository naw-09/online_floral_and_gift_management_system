import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  loading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
    setAuthLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setAuthLoading } = authSlice.actions
export default authSlice.reducer
