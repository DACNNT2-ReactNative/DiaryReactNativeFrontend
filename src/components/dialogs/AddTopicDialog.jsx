import React, { useState } from 'react';
import { Dialog, Paragraph, Portal, Button, HelperText } from 'react-native-paper';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { topicSelectors } from '../../redux/topic/selector';
import { authenticationSelectors } from '../../redux/authenticate/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import TextInput from '../TextInput';
import { usernameValidator } from '../../helpers/usernameValidator';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';
import { Alert } from 'react-native';

const AddTopicDialog = () => {
  const dispatch = useDispatch();
  const [topicName, setTopicName] = useState({ value: '', error: '' });
  const isAddTopicDialogVisible = useSelector(topicSelectors.isAddTopicDialogVisible);
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);

  const hideDialogAddTopic = () => {
    setTopicName({ value: '', error: '' });
    dispatch(topicActions.setAddTopicDialogVisible(false));
  };

  const { mutate: addTopic, isLoading } = useMutation(
    (topic) => {
      return axiosConfig.post('Topic/create-topic', topic);
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        const {topicId, name, userId} = response.data;
        const topicAdded = {
          topicId,
          name,
          userId
        };
        dispatch(topicActions.addTopicToTopics(topicAdded));
        hideDialogAddTopic();
      },
      onError: (error) => {
        if (error.title) {
          Alert.alert('', error.title);
        }
        Alert.alert('', error);
      },
    },
  );

  const onAddTopic = () => {
    const topicNameError = usernameValidator(topicName.value);
    if (topicNameError) {
      setTopicName({ ...topicName, error: topicNameError });
      return;
    }
    const data = {
      userId: currentUser.userId,
      name: topicName.value,
    };

    addTopic(data);
  };

  return (
    <Portal>
      <Dialog visible={isAddTopicDialogVisible} onDismiss={hideDialogAddTopic}>
        <Dialog.Content>
          <Paragraph>Thêm chủ để</Paragraph>
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
        </Dialog.Content>
        {isLoading ? <Loading /> : <></>}
        <Dialog.Actions>
          <Button onPress={onAddTopic}>Xác nhận</Button>
          <Button onPress={hideDialogAddTopic}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddTopicDialog;
