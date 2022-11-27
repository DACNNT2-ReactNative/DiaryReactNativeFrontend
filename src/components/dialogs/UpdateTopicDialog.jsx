import React, { useState } from 'react';
import { Dialog, Paragraph, Portal, Button, HelperText } from 'react-native-paper';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { usernameValidator } from '../../helpers/usernameValidator';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';
import TextInput from '../TextInput';

const UpdateTopicDialog = () => {
  const dispatch = useDispatch();
  const [topicName, setTopicName] = useState({ value: '', error: '' });
  const [error, setError] = useState(null);
  const isUpdateTopicDialogVisible = useSelector(topicSelectors.isUpdateTopicDialogVisible);
  const topicOnDialog = useSelector(topicSelectors.getTopicOnDialog);

  const hideDialogUpdateTopic = () => {
    setTopicName({ value: '', error: '' });
    setError(null);
    dispatch(topicActions.setTopicOnDialog(undefined));
    dispatch(topicActions.setUpdateTopicDialogVisible(false));
  };

  const { mutate: updateTopic, isLoading } = useMutation(
    (topic) => {
      return axiosConfig.put('Topic/update-topic', topic);
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        const topicUpdate = {
          topicId: response.data,
          name: topicName.value,
        };
        dispatch(topicActions.updateTopicInTopics(topicUpdate));
        hideDialogUpdateTopic();
      },
      onError: (error) => {
        console.log('error',error);
        setError(error);
      },
    },
  );

  const onUpdateTopic = () => {
    const topicNameError = usernameValidator(topicName.value);
    if (topicNameError) {
      setTopicName({ ...topicName, error: topicNameError });
      return;
    }
    console.log(topicOnDialog.topicId);
    const data = {
      topicId: topicOnDialog.topicId,
      name: topicName.value,
    };

    updateTopic(data);
  };

  return (
    <Portal>
      <Dialog visible={isUpdateTopicDialogVisible} onDismiss={hideDialogUpdateTopic}>
        <Dialog.Content>
          <Paragraph>Sửa chủ đề</Paragraph>
          <TextInput
            label="Tên chủ đề"
            returnKeyType="next"
            value={topicName.value}
            onChangeText={(text) => setTopicName({ value: text, error: '' })}
            error={!!topicName.error}
            errorText={topicName.error}
            autoCapitalize="none"
            autoCompleteType="topicName"
            textContentType="topicName"
            keyboardType="topicName"
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
        </Dialog.Content>
        {isLoading ? (
          <Loading />
        ) : (
          <Dialog.Actions>
            <Button onPress={onUpdateTopic}>Xác nhận</Button>
            <Button onPress={hideDialogUpdateTopic}>Hủy</Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};

export default UpdateTopicDialog;
