import React, { useEffect, useState } from 'react';
import { IconButton, List, Menu, Paragraph } from 'react-native-paper';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';
import { authenticationSelectors } from '../../redux/authenticate/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import { topicSelectors } from '../../redux/topic/selector';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const screen = Dimensions.get('screen');

const TopicList = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const topics = useSelector(topicSelectors.getTopics);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [topicSelected, setTopicSelected] = useState(undefined);
  const isFocused = useIsFocused();

  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  const onIconPress = (event) => {
    const { nativeEvent } = event;
    const anchor = {
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    };

    setMenuAnchor(anchor);
    openMenu();
  };

  const {
    data: topicList,
    isLoading: isGettingTopics,
    refetch,
  } = useQuery(
    ['topics'],
    async () => {
      if (currentUser === undefined) {
        return;
      }
      console.log('userId', currentUser.userId);
      const response = await axiosConfig.get('Topic/get-topics-by-user-id', {
        params: { userId: currentUser.userId },
      });
      return response.data;
    },
    {
      onError: () => {
        console.log('error get topics');
      },
    },
  );

  useEffect(() => {
    if (topicList) {
      dispatch(topicActions.setTopics(topicList));
    }
  }, [topicList]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.list}>
        {isGettingTopics ? (
          <Loading />
        ) : (
          [...topics].reverse().map((topic, index) => (
            <View key={topic.topicId} style={styles.listItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('DiaryList', { topic: topic })}
                onLongPress={(event) => {
                  onIconPress(event);
                  setTopicSelected(topic);
                }}
              >
                <View style={styles.topicNameBox}>
                  <Paragraph style={styles.topicName}>{topic.name}</Paragraph>
                </View>
                <Image
                  style={styles.images}
                  source={{
                    uri: `https://source.unsplash.com/random/200x200?${index}`,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Menu visible={showMenu} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={() => {
            dispatch(topicActions.setTopicOnDialog(topicSelected));
            dispatch(topicActions.setUpdateTopicDialogVisible(true));
            closeMenu();
          }}
          title="Sửa"
        />
        <Menu.Item
          onPress={() => {
            dispatch(topicActions.setTopicOnDialog(topicSelected));
            dispatch(topicActions.setDeleteTopicDialogVisible(true));
            closeMenu();
          }}
          title="Xóa"
        />
      </Menu>
    </>
  );
};

const styles = StyleSheet.create({
  listItem: {
    height: (screen.width - 40) / 2,
    width: (screen.width - 40) / 2,
    margin: 5,
    backgroundColor: 'transparent',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
    marginTop: 10,
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
    borderRadius: 5,
    padding: 3,
    overflow: 'hidden',
    fontSize: 16,
    color: 'white',
  },
  images: {
    height: (screen.width - 40) / 2,
    width: (screen.width - 40) / 2,
    resizeMode: 'cover',
    position: 'relative',
    borderRadius: 10,
    opacity: 0.9,
  },
});

export default TopicList;
