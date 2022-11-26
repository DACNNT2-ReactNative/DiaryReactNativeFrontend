import React, { useState } from 'react';
import { Dialog, Paragraph, Portal, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import TextInput from '../TextInput';

const AddTopicDialog = () => {
  const dispatch = useDispatch();
  const [topicName, setTopicName] = useState('');
  const isAddTopicDialogVisible = useSelector(topicSelectors.isAddTopicDialogVisible);

  const hideDialogAddTopic = () => {
    dispatch(topicActions.setAddTopicDialogVisible(false));
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
        <Dialog.Actions>
          <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
          <Button onPress={hideDialogAddTopic}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddTopicDialog;
