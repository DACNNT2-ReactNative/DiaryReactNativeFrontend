import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { topicNameValidator } from '../../helpers/inputValidator';
import { authenticationSelectors } from '../../redux/authenticate/selector';
import { topicSelectors } from '../../redux/topic/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';
import TextInput from '../TextInput';

const UpdateTopicDialog = () => {
  const dispatch = useDispatch();
  const isUpdateTopicDialogVisible = useSelector(topicSelectors.isUpdateTopicDialogVisible);
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const topicOnDialog = useSelector(topicSelectors.getTopicOnDialog);
  const [topicName, setTopicName] = useState({ value: '', error: '' });

  useEffect(() => {
    if (topicOnDialog) {
      setTopicName({ value: topicOnDialog.name, error: '' });
    }
  }, [topicOnDialog]);

  const hideDialogUpdateTopic = () => {
    setTopicName({ value: '', error: '' });
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
        const { topicId, name, userId } = response.data;
        const topicUpdate = {
          topicId,
          name,
          userId,
        };
        dispatch(topicActions.updateTopicInTopics(topicUpdate));
        hideDialogUpdateTopic();
      },
      onError: (error) => {
        if (error.title) {
          Alert.alert('', error.title);
        }
        Alert.alert('', error);
      },
    },
  );

  const onUpdateTopic = () => {
    const topicNameError = topicNameValidator(topicName.value);
    if (topicNameError) {
      setTopicName({ ...topicName, error: topicNameError });
      return;
    }
    console.log(topicOnDialog.topicId);
    const data = {
      topicId: topicOnDialog.topicId,
      userId: currentUser.userId,
      name: topicName.value,
    };

    if (data.name == topicOnDialog.name) {
      hideDialogUpdateTopic();
      return;
    }

    updateTopic(data);
  };

  return (
    <Portal>
      <Dialog
        style={styles.dialog}
        visible={isUpdateTopicDialogVisible}
        onDismiss={hideDialogUpdateTopic}
      >
        <Dialog.Content>
          <View style={styles.content}>
            <Paragraph>Sửa chủ đề</Paragraph>
            {isLoading ? (
              <View style={styles.loading}>
                <Loading />
              </View>
            ) : (
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
            )}
          </View>
        </Dialog.Content>
        {!isLoading && (
          <Dialog.Actions>
            <View style={styles.actions}>
              <View style={styles.button}>
                <Button onPress={hideDialogUpdateTopic}>Hủy</Button>
              </View>
              <View style={styles.button}>
                <Button onPress={onUpdateTopic}>Xác nhận</Button>
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
    height: 150,
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

export default UpdateTopicDialog;
