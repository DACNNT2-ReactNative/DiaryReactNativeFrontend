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
    addTopicToTopics: (state, { payload }) => {
      console.log(payload);
      console.log(state.topics);
      state.topics = [...state.topics, payload];
    },
    updateTopicInTopics: (state, { payload }) => {
      console.log('payload update topic', payload);
      const topics = state.topics;
      topics[topics.findIndex(x => x.topicId === payload.topicId)] = payload;
      state.topics = topics;
    },
    removeTopicFromTopics: (state, { payload }) => {
      console.log('payload delete topic',payload);
      const topics = state.topics;
      const topicAfterRemove = topics.filter(x => x.topicId !== payload.topicId);      
      state.topics = topicAfterRemove;
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
