import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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
      <Dialog
        style={styles.dialog}
        visible={isDeleteTopicDialogVisible}
        onDismiss={hideDialogDeleteTopic}
      >
        <Dialog.Content>
          <View style={styles.content}>
            <Paragraph>Bạn có muốn xóa chủ để này ?</Paragraph>
            {isLoading && (
              <View style={styles.loading}>
                <Loading />
              </View>
            )}
          </View>
        </Dialog.Content>
        {!isLoading && (
          <Dialog.Actions>
            <View style={styles.actions}>
              <View style={styles.button}>
                <Button onPress={hideDialogDeleteTopic}>Hủy</Button>
              </View>
              <View style={styles.button}>
                <Button onPress={onDeleteTopic}>Xác nhận</Button>
              </View>
            </View>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  loading: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    borderRadius: 25,
  },
  content: {
    marginBottom: -20,
  },
  actions: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    paddingBottom: 5,
  },
});

export default DeleteTopicDialog;
