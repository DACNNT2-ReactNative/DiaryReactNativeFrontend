import React, { useState } from 'react';
import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import TextInput from '../TextInput';

const UpdateTopicDialog = () => {
  const dispatch = useDispatch();
  const [topicName, setTopicName] = useState('');
  const isUpdateTopicDialogVisible = useSelector(topicSelectors.isUpdateTopicDialogVisible);

  const hideDialogUpdateTopic = () => {
    dispatch(topicActions.setUpdateTopicDialogVisible(false));
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
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
          <Button onPress={hideDialogUpdateTopic}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default UpdateTopicDialog;
