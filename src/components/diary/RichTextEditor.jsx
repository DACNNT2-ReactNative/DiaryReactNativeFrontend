import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import axiosConfig from '../../utils/axios';
import { getFileInfo, isLessThanTheMB } from '../../utils/checkFileSize';
import { useDispatch, useSelector } from 'react-redux';
import { diarySelectors } from '../../redux/diary/selector';
import { actions as diaryActions } from '../../redux/diary/slice';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { getTitleFromContent } from '../../utils/getTitleFromContent';
import { IconButton, Paragraph } from 'react-native-paper';
import Loading from '../Loading';
import { getFullDateAndTime, getFullTime } from '../../utils/converDateTime';

const screen = Dimensions.get('screen');

const RichTextEditor = ({ diary, navigation }) => {
  const richText = useRef();
  const dispatch = useDispatch();
  const [textHtml, setTextHtml] = useState(diary.content);
  const [timeUpdated, setTimeUpdated] = useState(diary.updateAt);
  const editingDiary = useSelector(diarySelectors.getCurrentEditingDiary);

  const pickImage = async () => {
    const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (gallery.granted === false) {
      console.log('not has permissions');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (imageResult.cancelled) return;

    if (imageResult.type !== 'image') return;

    const fileInfo = await getFileInfo(imageResult.uri);

    if (!fileInfo?.size) {
      Alert.alert('alert', "Can't select this file as the size is unknown.");
      return;
    }

    const isLessThan1MB = isLessThanTheMB(fileInfo.size, 1);
    if (!isLessThan1MB) {
      Alert.alert('alert', 'Image size must be smaller than 1MB!');
      return;
    }

    const time = new Date().getTime();
    const data = {
      ImageName: 'image' + time.toString() + '.png',
      Base64String: imageResult?.base64,
    };
    const response = await axiosConfig.post('Authenticate/upload-image', data);
    richText.current.insertImage(response.data);
  };

  const openCamera = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    if (camera.granted === false) {
      console.log('Camera not granted');
      return;
    }

    const imageResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (imageResult.cancelled) return;

    if (imageResult.type !== 'image') {
      Alert.alert('', 'Hình ảnh không đúng định dạng');
      return;
    }

    const fileInfo = await getFileInfo(imageResult.uri);

    if (!fileInfo?.size) {
      Alert.alert('', 'Hình ảnh không hợp lệ');
      return;
    }

    const isLessThan1MB = isLessThanTheMB(fileInfo.size, 1);
    if (!isLessThan1MB) {
      Alert.alert('', 'Hình ảnh phải có dung lượng nhỏ hơn 1MB!');
      return;
    }

    const time = new Date().getTime();
    const data = {
      ImageName: 'test' + time.toString() + '.png',
      Base64String: imageResult?.base64,
    };
    const response = await axiosConfig.post('Authenticate/upload-image', data);
    richText.current.insertImage(response.data);
  };

  const { mutate: updateDiary, isLoading: isUpdating } = useMutation(
    (diary) => {
      return axiosConfig.put('Diary/update-diary', diary);
    },
    {
      onSuccess: (response) => {
        console.log('updated', response.data);
        setTimeUpdated(response.data.updateAt);
        dispatch(diaryActions.updateDiaryInDiaries(response.data));
      },
      onError: (error) => {
        console.log(error);
      },
    },
  );

  const { mutate: saveDiary, isLoading: isSaving } = useMutation(
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

  const richTextHandle = (descriptionText) => {
    setTextHtml(descriptionText);
    console.log('content', descriptionText);
  };

  useEffect(() => {
    const title = getTitleFromContent(textHtml);
    console.log('title', title);
    const updatedDiary = {
      diaryId: diary.diaryId,
      content: textHtml,
      title: title,
    };
    const timer = setTimeout(() => {
      updateDiary(updatedDiary);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [textHtml]);

  const onSave = () => {
    const title = getTitleFromContent(textHtml);
    const updatedDiary = {
      diaryId: diary.diaryId,
      content: textHtml,
      title: title,
    };
    saveDiary(updatedDiary);
  };

  return (
    <View style={styles.richTextContainer}>
      <ScrollView>
        <RichEditor
          ref={richText}
          onChange={richTextHandle}
          placeholder="Tiêu đề"
          androidHardwareAccelerationDisabled={true}
          style={styles.richTextEditorStyle}
          initialHeight={screen.height - 70}
          initialContentHTML={diary.content ? diary.content : ''}
        />
      </ScrollView>
      <IconButton
        style={styles.saveButton}
        icon="content-save-edit"
        onPress={() => {
          console.log('click');
          onSave();
        }}
      />
      <Paragraph style={styles.lastSave}>
        Chỉnh sửa lần cuối vào {isUpdating ? '...' : getFullDateAndTime(timeUpdated)}
      </Paragraph>
      <RichToolbar
        editor={richText}
        selectedIconTint="#fe4141"
        iconTint="#e751d5"
        actions={[
          actions.undo,
          actions.insertVideo,
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.setUnderline,
          actions.redo,
          actions.fontSize,
          actions.keyboard,
        ]}
        onPressAddImage={pickImage}
        insertVideo={openCamera}
        style={styles.richTextToolbarStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  richTextContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%',
  },
  richTextEditorStyle: {
    fontSize: 20,
  },
  saveButton: {
    position: 'absolute',
    zIndex: 10,
    top: 45,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 1,
  },
  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderWidth: 1,
    color: '#fff',
  },
  lastSave: {
    marginTop: 10,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default RichTextEditor;
