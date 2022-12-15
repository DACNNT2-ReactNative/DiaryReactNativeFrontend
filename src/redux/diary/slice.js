import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  diaries: [],
  diaryOnDialog: undefined,
  isCreateDiaryDialogVisible: false,
  isDeleteDiaryDialogVisible: false,
};

export const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDiaries: (state, { payload }) => {
      state.diaries = payload;
    },
    addDiaryToDiaries: (state, { payload }) => {
      state.diaries = [...state.diaries, payload];
    },
    removeDiaryFromList: (state, { payload }) => {
      console.log('payload delete diary',payload);
      const diaries = state.diaries;
      const diariesAfterRemove = diaries.filter(x => x.diaryId !== payload.diaryId);      
      state.diaries = diariesAfterRemove;
    },
    setDiaryOnDialog: (state, { payload }) => {
      state.diaryOnDialog = payload;
    },
    setCreateDiaryDialogVisible: (state, { payload }) => {
      state.isCreateDiaryDialogVisible = payload;
    },
    setDeleteDiaryDialogVisible: (state, { payload }) => {
      state.isDeleteDiaryDialogVisible = payload;
    },
  },
});

export const { name, actions, reducer } = diarySlice;
