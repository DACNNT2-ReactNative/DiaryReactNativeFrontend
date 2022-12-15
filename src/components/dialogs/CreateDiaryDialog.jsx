import React from 'react';
import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dialog, IconButton, Paragraph, Portal } from 'react-native-paper';
import { diarySelectors } from '../../redux/diary/selector';
import { authenticationSelectors } from '../../redux/authenticate/selector';
import { useDispatch, useSelector } from 'react-redux';
import { actions as diaryActions } from '../../redux/diary/slice';
import { useMutation } from 'react-query';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';

const screen = Dimensions.get('screen');

const CreateDiaryDialog = (props) => {
  const dispatch = useDispatch();
  const isCreateDiaryDialogVisible = useSelector(diarySelectors.isCreateDiaryDialogVisible);
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);

  const hideDialogCreateDiary = () => {
    dispatch(diaryActions.setCreateDiaryDialogVisible(false));
  };

  const { mutate: createDiary, isLoading } = useMutation(
    (diary) => {
      console.log('diary', diary);
      return axiosConfig.post('Diary/create-diary', diary);
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        dispatch(diaryActions.addDiaryToDiaries({ diaryId: response.data, content: null }));
        hideDialogCreateDiary();
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

  const onCreateDiary = (type) => {
    console.log(type);
    const diary = {
      userId: props.topic.userId,
      topicId: props.topic.topicId,
      type: type,
    };
    createDiary(diary);
  };

  return (
    <Portal>
      <Dialog
        style={styles.dialog}
        visible={isCreateDiaryDialogVisible}
        onDismiss={hideDialogCreateDiary}
      >
        <Dialog.Content>
          <IconButton style={styles.closeButton} icon="close" onPress={hideDialogCreateDiary} />
          <View style={styles.content}>
            <Paragraph style={styles.title}>Cảm xúc của bạn hiện tại</Paragraph>
            {isLoading ? (
              <View style={styles.loading}>
                <Loading />
              </View>
            ) : (
              <View style={styles.listIcon}>
                <TouchableOpacity style={styles.iconItem} onPress={() => onCreateDiary('happy')}>
                  <Image source={require('../../assets/happy.png')} style={styles.iconImages} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconItem} onPress={() => onCreateDiary('sad')}>
                  <Image source={require('../../assets/sad.png')} style={styles.iconImages} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconItem} onPress={() => onCreateDiary('surprise')}>
                  <Image source={require('../../assets/surprise.png')} style={styles.iconImages} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconItem} onPress={() => onCreateDiary('fear')}>
                  <Image source={require('../../assets/fear.png')} style={styles.iconImages} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Dialog.Content>
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
    alignItems: 'center',
  },
  closeButton: {
    zIndex: 10,
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  listIcon: {
    height: screen.width - 80,
    width: screen.width - 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  iconItem: {
    height: (screen.width - 220) / 2,
    width: (screen.width - 220) / 2,
    margin: 30,
    backgroundColor: 'transparent',
  },
  iconImages: {
    height: (screen.width - 220) / 2,
    width: (screen.width - 220) / 2,
    resizeMode: 'cover',
    position: 'relative',
  },
});

export default CreateDiaryDialog;
