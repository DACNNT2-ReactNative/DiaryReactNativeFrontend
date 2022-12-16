const getDiaries = (state) => state.diary?.diaries;

const isCreateDiaryDialogVisible = (state) => state?.diary?.isCreateDiaryDialogVisible;

const isDeleteDiaryDialogVisible = (state) => state?.diary?.isDeleteDiaryDialogVisible;

const getDiaryOnDialog = (state) => state.diary?.diaryOnDialog;

const getCurrentEditingDiary = (state) => state.diary?.currentEditingDiary;

export const diarySelectors = {
  getDiaries,
  isCreateDiaryDialogVisible,
  isDeleteDiaryDialogVisible,
  getDiaryOnDialog,
  getCurrentEditingDiary,
};
