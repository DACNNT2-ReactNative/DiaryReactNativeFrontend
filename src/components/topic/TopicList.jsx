import React, { useEffect, useState } from 'react';
import { IconButton, List, Menu } from 'react-native-paper';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';
import { authenticationSelectors } from '../../redux/authenticate/selector';
import { actions as topicActions } from '../../redux/topic/slice';
import { topicSelectors } from '../../redux/topic/selector';
import { StyleSheet, View } from 'react-native';

const TopicList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const topics = useSelector(topicSelectors.getTopics);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [topicSelected, setTopicSelected] = useState(undefined);

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

  const { data: topicList, isLoading: isGettingTopics } = useQuery(
    ['topics'],
    async () => {
      if (currentUser === undefined) {
        return;
      }
      console.log('userId', currentUser.userId);
      const response = await axiosConfig.get('Topic/get-topics-by-user-id', { params: { userId: currentUser.userId } });
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
      <List.Subheader>Danh sách chủ để</List.Subheader>
      {isGettingTopics ? (
        <Loading />
      ) : (
        topics.map((topic) => (
          <List.Item
            key={topic.topicId}
            style={styles.listItem}
            onPress={() => console.log('Pressed')}
            title={topic.name}
            left={() => <List.Icon icon="folder" />}
            right={() => (
              <IconButton
                onPress={(event) => {
                  onIconPress(event);
                  setTopicSelected(topic);
                }}
                icon="dots-vertical"
              />
            )}
          />
        ))
      )}

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
      <IconButton
        style={styles.addButton}
        icon="plus"
        onPress={() => {
          dispatch(topicActions.setAddTopicDialogVisible(true));
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default TopicList;
