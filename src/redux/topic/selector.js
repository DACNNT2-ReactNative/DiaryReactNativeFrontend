const getTopics = (state) => state.topic?.topics;

const isAddTopicDialogVisible = (state) => state?.topic?.isAddTopicDialogVisible;

const isUpdateTopicDialogVisible = (state) => state?.topic?.isUpdateTopicDialogVisible;

const isDeleteTopicDialogVisible = (state) => state?.topic?.isDeleteTopicDialogVisible;

const getTopicOnDialog = (state) => state.topic?.topicOnDialog;

export const topicSelectors = { getTopics, isAddTopicDialogVisible, isUpdateTopicDialogVisible, isDeleteTopicDialogVisible, getTopicOnDialog };
