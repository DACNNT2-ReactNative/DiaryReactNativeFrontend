import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  user: undefined,
  isAuthenticated: false,
};

export const authenticationSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload;
    },
  },
});

export const { name, actions, reducer } = authenticationSlice;
