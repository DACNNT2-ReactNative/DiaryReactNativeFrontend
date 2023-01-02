import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Dialog, Divider, List } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { SharedElement } from 'react-navigation-shared-element';
import { useMutation } from 'react-query';
import axiosConfig from '../utils/axios';
import { actions as diaryActions } from '../redux/diary/slice';
import { useDispatch } from 'react-redux';
import { diaryStatus } from '../constants/diaryStatus';

const screen = Dimensions.get('screen');

const DiaryOption = ({ route, navigation }) => {
  const { diary } = route.params;
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [contentVisible, setContentVisible] = useState(true);
  const [actionVisible, setActionVisible] = useState(true);

  const { mutate: updateDiary, isLoading: isUpdating } = useMutation(
    (diary) => {
      return axiosConfig.put('Diary/update-diary', diary);
    },
    {
      onSuccess: (response) => {
        console.log('updated', response.data);
        dispatch(diaryActions.updateDiaryInDiaries(response.data));
        navigation.goBack();
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  const { mutate: deleteDiary, isLoading: isDeleting } = useMutation(
    (diaryId) => {
      return axiosConfig.delete('Diary/delete-diary-by-id', { params: { diaryId: diaryId } });
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        const diaryDelete = {
          diaryId: response.data,
        };
        dispatch(diaryActions.removeDiaryFromList(diaryDelete));
        navigation.goBack();
        Alert.alert('', 'Xóa nhật ký thành công');
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

  const deleteAlert = () =>
    Alert.alert(
      '',
      'Bạn có muốn xóa nhật ký này?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {
            console.log('cancle');
          },
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            deleteDiary(diary.diaryId);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          console.log('dismiss');
        },
      },
    );

  const WebDisplay = React.memo(function WebDisplay({ content }) {
    const imgWidth = screen.width - 50;
    const tagsStyles = {
      body: {
        whiteSpace: 'normal',
        color: 'gray',
      },
      div: {
        fontSize: '12px',
      },
      img: {
        height: 'auto',
        width: 'auto',
        maxWidth: `${imgWidth}px`,
        maxHeight: `${imgWidth}px`,
        transform: [{ scale: 0.7 }],
      },
    };
    return (
      <RenderHTML
        enableExperimentalBRCollapsing={true}
        contentWidth={width}
        source={{ html: content }}
        tagsStyles={tagsStyles}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Dialog
        style={styles.dialog}
        visible={contentVisible}
        onDismiss={() => {
          if (isUpdating) {
            return;
          }
          setActionVisible(false);
          navigation.goBack();
        }}
      >
        {contentVisible && (
          <SharedElement id={diary.diaryId}>
            <View style={styles.diary}>
              <WebDisplay content={diary.content ? diary.content : source.html} />
            </View>
          </SharedElement>
        )}
        {actionVisible && (
          <View style={styles.actions}>
            <List.Item
              title="Chỉnh sửa"
              right={(props) => <List.Icon {...props} icon="clipboard-edit-outline" />}
              onPress={() => {
                setContentVisible(false);
                navigation.replace('DiaryEdit', { diary: diary });
              }}
            />
            <Divider />
            <Divider />
            <List.Item
              title="Yêu thích"
              right={(props) =>
                diary.isLiked ? (
                  <List.Icon {...props} icon="heart" />
                ) : (
                  <List.Icon {...props} icon="heart-outline" />
                )
              }
              onPress={() => {
                const updatedDiary = {
                  diaryId: diary.diaryId,
                  isLiked: !diary.isLiked,
                };
                updateDiary(updatedDiary);
                setActionVisible(false);
              }}
            />
            <Divider />
            {diary.status === diaryStatus.private && (
              <List.Item
                title="Chia sẻ"
                right={(props) => <List.Icon {...props} icon="share" />}
                onPress={() => {
                  const updatedDiary = {
                    diaryId: diary.diaryId,
                    status: diaryStatus.public,
                  };
                  updateDiary(updatedDiary);
                  setActionVisible(false);
                }}
              />
            )}
            {diary.status === diaryStatus.public && (
              <List.Item
                title="Gỡ chia sẻ"
                right={(props) => <List.Icon {...props} icon="share-off" />}
                onPress={() => {
                  const updatedDiary = {
                    diaryId: diary.diaryId,
                    status: diaryStatus.private,
                  };
                  updateDiary(updatedDiary);
                  setActionVisible(false);
                }}
              />
            )}
            <Divider />
            <List.Item
              title="Xóa"
              right={(props) => <List.Icon {...props} icon="delete" />}
              onPress={() => {
                deleteAlert();
              }}
            />
            <Divider />
          </View>
        )}
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  dialog: {
    backgroundColor: 'transparent',
    height: screen.width,
    width: screen.width,
    marginTop: -150,
    marginLeft: 0,
    alignItems: 'center',
    elevation: 0,
  },
  diary: {
    height: screen.width - 50,
    width: screen.width - 50,
    backgroundColor: '#fbead1',
    borderRadius: 12,
    padding: 20,
    overflow: 'hidden',
  },
  actions: {
    width: screen.width / 2,
    backgroundColor: '#fbead1',
    marginTop: 20,
    borderRadius: 10,
  },
});

export default DiaryOption;
