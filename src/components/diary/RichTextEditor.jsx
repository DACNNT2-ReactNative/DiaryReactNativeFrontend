import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { diarySelectors } from '../../redux/diary/selector';
import { actions as diaryActions } from '../../redux/diary/slice';
import axiosConfig from '../../utils/axios';
import { getFileInfo, getImageData, isLessThanTheMB } from '../../utils/checkFileSize';
import { getFullDateAndTime } from '../../utils/converDateTime';

const screen = Dimensions.get('screen');

const RichTextEditor = ({ diary, navigation }) => {
  const richText = useRef();
  const dispatch = useDispatch();
  const [textHtml, setTextHtml] = useState(diary.content);
  const [fontSize, setFontSize] = useState(16);
  const [timeUpdated, setTimeUpdated] = useState(diary.updateAt);

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation(
    (data) => {
      return axiosConfig.post('Authenticate/upload-image', data);
    },
    {
      onSuccess: (response) => {
        richText.current.insertImage(response.data, 'width: 100px, height: 100px');
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

  console.log(fontSize);
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
      height: 10,
      width: 10,
    });

    const data = await getImageData(imageResult, diary.diaryId);
    if (!data) {
      return;
    }
    uploadImage(data);
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
      height: 10,
      width: 10,
    });

    const data = await getImageData(imageResult, diary.diaryId);
    if (!data) {
      return;
    }
    uploadImage(data);
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
    const updatedDiary = {
      diaryId: diary.diaryId,
      content: textHtml,
    };
    const timer = setTimeout(() => {
      updateDiary(updatedDiary);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [textHtml]);

  const onSave = () => {
    const updatedDiary = {
      diaryId: diary.diaryId,
      content: textHtml,
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
          editorStyle={{
            contentCSSText: `font-size: ${fontSize}px;`,
          }}
          initialHeight={screen.height - 70}
          initialContentHTML={diary.content ? diary.content : ''}
        />
      </ScrollView>
      <Paragraph style={styles.lastSave}>
        Chỉnh sửa lần cuối vào {isUpdating ? '...' : getFullDateAndTime(timeUpdated)}
      </Paragraph>
      <RichToolbar
        editor={richText}
        selectedIconTint="#fe4141"
        iconTint="#000000"
        actions={[
          actions.fontSize,
          actions.fontSizeDown,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.alignFull,
          actions.keyboard,
        ]}
        iconMap={{
          [actions.fontSize]: ({ tintColor }) => (
            <IconButton
              color={tintColor}
              icon="format-font-size-increase"
              onPress={() => {
                setFontSize((prev) => prev + 2);
              }}
            />
          ),
          [actions.fontSizeDown]: ({ tintColor }) => (
            <IconButton
              color={tintColor}
              icon="format-font-size-decrease"
              onPress={() => {
                setFontSize((prev) => prev - 2);
              }}
            />
          ),
        }}
        style={styles.richTextToolbarStyle}
      />
      <RichToolbar
        editor={richText}
        selectedIconTint="#fe4141"
        iconTint="#000000"
        actions={[
          actions.insertVideo,
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.undo,
          actions.redo,
          actions.save,
        ]}
        iconMap={{
          [actions.save]: ({ tintColor }) => (
            <IconButton
              color={tintColor}
              icon="content-save-edit"
              onPress={() => {
                onSave();
              }}
            />
          ),
        }}
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
