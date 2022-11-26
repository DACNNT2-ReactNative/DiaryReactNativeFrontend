import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  topics: [],
  topicOnDialog: undefined,
  isAddTopicDialogVisible: false,
  isUpdateTopicDialogVisible: false,
  isDeleteTopicDialogVisible: false,
};

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setTopics: (state, { payload }) => {
      state.topics = payload;
    },
    setTopicOnDialog: (state, { payload }) => {
      state.topicOnDialog = payload;
    },
    setAddTopicDialogVisible: (state, { payload }) => {
      state.isAddTopicDialogVisible = payload;
    },
    setUpdateTopicDialogVisible: (state, { payload }) => {
      state.isUpdateTopicDialogVisible = payload;
    },
    setDeleteTopicDialogVisible: (state, { payload }) => {
      state.isDeleteTopicDialogVisible = payload;
    },
  },
});

export const { name, actions, reducer } = topicSlice;
