import { createSlice } from '@reduxjs/toolkit';

const initialUser = {
    userId: '',
}

export const initialState = {
    user: initialUser,
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
        }
    },
});

export const { name, actions, reducer } = authenticationSlice;