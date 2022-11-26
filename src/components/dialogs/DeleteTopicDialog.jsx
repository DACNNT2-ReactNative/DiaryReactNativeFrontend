import React from 'react';
import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';

const DeleteTopicDialog = () => {
  const dispatch = useDispatch();
  const isDeleteTopicDialogVisible = useSelector(topicSelectors.isDeleteTopicDialogVisible);

  const hideDialogDeleteTopic = () => {
    dispatch(topicActions.setDeleteTopicDialogVisible(false));
  };
  return (
    <Portal>
      <Dialog visible={isDeleteTopicDialogVisible} onDismiss={hideDialogDeleteTopic}>
        <Dialog.Content>
          <Paragraph>Bạn có muốn xóa chủ để này ?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
          <Button onPress={hideDialogDeleteTopic}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteTopicDialog;
