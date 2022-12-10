import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import axiosConfig from '../../utils/axios';
import { getFileInfo, isLessThanTheMB } from '../../utils/checkFileSize';

const screen = Dimensions.get('screen');

const RichTextEditor = () => {
  const richText = useRef();
  const [contentHtml, setContentHtml] = useState(
    '<div>ùcuc uvigig ugigiv gvuv</div><div>uviviv hhhh<img src="https://i.pinimg.com/originals/6f/5a/34/6f5a34181beb2c2de8185d39255ad08a.jpg" style="font-size: 1em;"></div>',
  );

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

  const richTextHandle = (descriptionText) => {
    console.log(descriptionText);
  };

  return (
    <View style={styles.richTextContainer}>
      <ScrollView>
        <RichEditor
          ref={richText}
          onChange={richTextHandle}
          placeholder="Write your cool content here :)"
          androidHardwareAccelerationDisabled={true}
          style={styles.richTextEditorStyle}
          initialHeight={screen.height - 70}
          initialContentHTML={contentHtml}
        />
      </ScrollView>
      <RichToolbar
        editor={richText}
        selectedIconTint="#dcf51d"
        iconTint="#90dc7b"
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderRadius: 10,
    borderWidth: 1,
    color: '#fff',
  },
});

export default RichTextEditor;
