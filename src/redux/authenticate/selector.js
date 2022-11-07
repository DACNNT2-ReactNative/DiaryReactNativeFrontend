const isUserAuthenticated = (state) => state?.authentication?.isAuthenticated;

const getCurrentUser = (state) => state.authentication?.user;

export const authenticationSelectors = { isUserAuthenticated, getCurrentUser };