import React from 'react';
import { Alert } from 'react-native';
import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';

const DeleteTopicDialog = () => {
  const dispatch = useDispatch();
  const isDeleteTopicDialogVisible = useSelector(topicSelectors.isDeleteTopicDialogVisible);
  const topicOnDialog = useSelector(topicSelectors.getTopicOnDialog);

  const hideDialogDeleteTopic = () => {
    dispatch(topicActions.setDeleteTopicDialogVisible(false));
  };

  const { mutate: deleteTopic, isLoading } = useMutation(
    (topicId) => {
      return axiosConfig.delete('Topic/delete-topic-by-id', { params: { topicId: topicId } });
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        const topicDelete = {
          topicId: response.data,
        };
        dispatch(topicActions.removeTopicFromTopics(topicDelete));
        hideDialogDeleteTopic();
        Alert.alert('', 'Xóa chủ đề thành công');
      },
      onError: (error) => {
        if (error.title) {
          Alert.alert('', error.title);
        }
        Alert.alert('', error);
      },
    },
  );

  const onDeleteTopic = () => {
    deleteTopic(topicOnDialog.topicId);
  };

  return (
    <Portal>
      <Dialog visible={isDeleteTopicDialogVisible} onDismiss={hideDialogDeleteTopic}>
        <Dialog.Content>
          <Paragraph>Bạn có muốn xóa chủ để này ?</Paragraph>
        </Dialog.Content>
        {isLoading ? <Loading /> : <></>}
        <Dialog.Actions>
          <Button onPress={onDeleteTopic}>Xác nhận</Button>
          <Button onPress={hideDialogDeleteTopic}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteTopicDialog;
