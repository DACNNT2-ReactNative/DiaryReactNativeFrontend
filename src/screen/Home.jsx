import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, List, Menu } from 'react-native-paper';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import AddTopicDialog from '../components/dialogs/AddTopicDialog';
import DeleteTopicDialog from '../components/dialogs/DeleteTopicDialog';
import UpdateTopicDialog from '../components/dialogs/UpdateTopicDialog';
import Loading from '../components/Loading';
import { authenticationSelectors } from '../redux/authenticate/selector';
import { actions as topicActions } from '../redux/topic/slice';
import axiosConfig from '../utils/axios';
import { topicSelectors } from '../redux/topic/selector';

function Home() {
  const dispatch = useDispatch();
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const topics = useSelector(topicSelectors.getTopics);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });

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
      console.log('userId', currentUser.userId);
      const response = await axiosConfig.get('Topic/get-topics-by-user-id', { params: {userId: currentUser.userId}});
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
    <View style={styles.container}>
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
            right={() => <IconButton onPress={onIconPress} icon="dots-vertical" />}
          />
        ))
      )}

      <Menu visible={showMenu} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={() => {
            dispatch(topicActions.setUpdateTopicDialogVisible(true));
            closeMenu();
          }}
          title="Sửa"
        />
        <Menu.Item
          onPress={() => {
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

      <AddTopicDialog />
      <UpdateTopicDialog />
      <DeleteTopicDialog />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
export default Home;
