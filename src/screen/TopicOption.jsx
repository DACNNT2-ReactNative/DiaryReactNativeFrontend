import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, View } from 'react-native';
import { Dialog, Divider, List, Paragraph } from 'react-native-paper';
import { SharedElement } from 'react-navigation-shared-element';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { actions as topicActions } from '../redux/topic/slice';
import axiosConfig from '../utils/axios';
import { getImageData } from '../utils/checkFileSize';

const screen = Dimensions.get('screen');

const TopicOption = ({ route, navigation }) => {
  const { topic } = route.params;
  console.log(topic);
  const dispatch = useDispatch();
  const [actionVisible, setActionVisible] = useState(true);

  const { mutate: updateTopic, isLoading: isUpdatingTopic } = useMutation(
    (topic) => {
      return axiosConfig.put('Topic/update-topic', topic);
    },
    {
      onSuccess: (response) => {
        dispatch(topicActions.updateTopicInTopics(response.data));
        navigation.goBack();
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

  const { mutate: uploadImage, isLoading: isUploadingImage } = useMutation(
    (data) => {
      return axiosConfig.post('Authenticate/upload-image', data);
    },
    {
      onSuccess: (response) => {
        console.log(response.data);
        const updatingTopic = {
          topicId: topic.topicId,
          userId: topic.userId,
          image: response.data,
        };

        updateTopic(updatingTopic);
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

    const data = await getImageData(imageResult, topic.topicId);
    if (!data) {
      return;
    }
    uploadImage(data);
  };

  return (
    <View style={styles.container}>
      <Dialog
        style={styles.dialog}
        visible={true}
        onDismiss={() => {
          if (isUploadingImage || isUpdatingTopic) {
            return;
          }
          setActionVisible(false);
          navigation.goBack();
        }}
      >
        <SharedElement id={topic.topicId}>
          <View key={topic.topicId} style={styles.topic}>
            <View style={styles.topicNameBox}>
              <Paragraph style={styles.topicName}>{topic.name}</Paragraph>
            </View>
            {isUploadingImage || isUpdatingTopic ? (
              <View style={styles.loading}>
                <Loading />
              </View>
            ) : (
              <Image
                style={styles.images}
                source={{
                  uri: topic.image ? topic.image : `https://source.unsplash.com/random/200x200?1`,
                }}
              />
            )}
          </View>
        </SharedElement>
        {actionVisible && (
          <View style={styles.actions}>
            <List.Item
              title="Đổi ảnh nền"
              right={(props) => <List.Icon {...props} icon="image-edit" />}
              onPress={() => {
                pickImage();
              }}
            />
            <Divider />
            <List.Item
              title="Đổi tên"
              right={(props) => <List.Icon {...props} icon="clipboard-edit-outline" />}
              onPress={() => {
                dispatch(topicActions.setTopicOnDialog(topic));
                dispatch(topicActions.setUpdateTopicDialogVisible(true));
                navigation.goBack();
              }}
            />
            <Divider />
            <List.Item
              title="Xóa"
              right={(props) => <List.Icon {...props} icon="delete" />}
              onPress={() => {
                dispatch(topicActions.setTopicOnDialog(topic));
                dispatch(topicActions.setDeleteTopicDialogVisible(true));
                navigation.goBack();
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
  topic: {
    height: screen.width - 50,
    width: screen.width - 50,
    borderRadius: 10,
  },
  loading: {
    height: screen.width - 50,
    width: screen.width - 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c9c9c9',
  },
  images: {
    height: screen.width - 50,
    width: screen.width - 50,
    resizeMode: 'cover',
    position: 'relative',
    borderRadius: 10,
    opacity: 0.9,
  },
  topicNameBox: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicName: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    overflow: 'hidden',
    fontSize: 32,
    lineHeight: 32,
    color: 'white',
  },
  actions: {
    width: screen.width / 2,
    backgroundColor: '#eeeeee',
    marginTop: 20,
    borderRadius: 10,
  },
});
export default TopicOption;
