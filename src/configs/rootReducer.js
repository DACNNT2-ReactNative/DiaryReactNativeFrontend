import { combineReducers } from '@reduxjs/toolkit';
import { reducer as authenticateReducer } from '../redux/authenticate/slice';
import { reducer as topicReducer } from '../redux/topic/slice';

const createReducer = (injectedReducers = {}) => {
  const appReducer = combineReducers({
    authentication: authenticateReducer,
    topic: topicReducer,
    ...injectedReducers,
  });

  return appReducer;
};

export default createReducer;
