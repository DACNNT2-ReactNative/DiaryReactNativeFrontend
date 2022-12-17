import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const getFileInfo = async (fileURI) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI);
  return fileInfo;
};

export const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
  const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
  return isOk;
};

export const getImageData = async (imageResult, id) => {
  if (imageResult.cancelled) return;

  if (imageResult.type !== 'image') {
    Alert.alert('', 'Hình ảnh không đúng định dạng.');
    return;
  }

  const fileInfo = await getFileInfo(imageResult.uri);

  if (!fileInfo?.size) {
    Alert.alert('', 'Hình ảnh không hợp lệ.');
    return;
  }

  const isLessThan1MB = isLessThanTheMB(fileInfo.size, 1);
  if (!isLessThan1MB) {
    Alert.alert('', 'Hình ảnh phải có dung lượng nhỏ hơn 1MB!');
    return;
  }

  const time = new Date().getTime();
  const data = {
    ImageName: 'image' + time.toString() + id + '.png',
    Base64String: imageResult?.base64,
  };

  return data;
};
