import React, { useState } from 'react';
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
        const { topicId, name, userId } = response.data;
        const topicAdded = {
          topicId,
          name,
          userId,
        };
        dispatch(topicActions.addTopicToTopics(topicAdded));
        hideDialogAddTopic();
      },
      onError: (error) => {
        if (error.title) {
          Alert.alert('', error.title);
        } else {
          Alert.alert('', error);
        }
      },
    },
  );

  const onAddTopic = () => {
    const topicNameError = topicNameValidator(topicName.value);
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
      <Dialog
        style={styles.dialog}
        visible={isAddTopicDialogVisible}
        onDismiss={hideDialogAddTopic}
      >
        <Dialog.Content>
          <View style={styles.content}>
            <Paragraph>Thêm chủ để</Paragraph>
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
                <Button onPress={hideDialogAddTopic}>Hủy</Button>
              </View>
              <View style={styles.button}>
                <Button onPress={onAddTopic}>Xác nhận</Button>
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

export default AddTopicDialog;
