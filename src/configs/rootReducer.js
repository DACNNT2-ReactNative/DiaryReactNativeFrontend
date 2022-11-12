import { combineReducers } from '@reduxjs/toolkit';
import { reducer as authenticateReducer } from '../redux/authenticate/slice';

const createReducer = (injectedReducers = {}) => {
  const appReducer = combineReducers({
    authentication: authenticateReducer,
    ...injectedReducers,
  });

  return appReducer;
};

export default createReducer;
