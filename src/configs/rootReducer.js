import { combineReducers } from '@reduxjs/toolkit';
import { reducer as authenticateReducer } from '../redux/authenticate/slice';
import { reducer as topicReducer } from '../redux/topic/slice';
import { reducer as diaryReducer } from '../redux/diary/slice';

const createReducer = (injectedReducers = {}) => {
  const appReducer = combineReducers({
    authentication: authenticateReducer,
    topic: topicReducer,
    diary: diaryReducer,
    ...injectedReducers,
  });

  return appReducer;
};

export default createReducer;
