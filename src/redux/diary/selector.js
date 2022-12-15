const getDiaries = (state) => state.diary?.diaries;

const isCreateDiaryDialogVisible = (state) => state?.diary?.isCreateDiaryDialogVisible;

const isDeleteDiaryDialogVisible = (state) => state?.diary?.isDeleteDiaryDialogVisible;

const getDiaryOnDialog = (state) => state.topic?.diaryOnDialog;

export const diarySelectors = {
  getDiaries,
  isCreateDiaryDialogVisible,
  isDeleteDiaryDialogVisible,
  getDiaryOnDialog,
};
