import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { authenticationSelectors } from '../redux/authenticate/selector';
import { useSelector } from 'react-redux';
import TextInput from '../components/TextInput';

import { IconButton, List, Menu, Portal, Dialog, Paragraph, Button } from 'react-native-paper';

function Home() {
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [topic, setTopic] = useState([]);
  const [topicName, setTopicName] = useState('');

  const hideDialogDelete = () => setVisibleDelete(false);
  const showDialogDelete = () => setVisibleDelete(true);
  const hideDialogAdd = () => setVisibleAdd(false);
  const showDialogAdd = () => setVisibleAdd(true);
  const hideDialogUpdate = () => setVisibleUpdate(false);
  const showDialogUpdate = () => setVisibleUpdate(true);
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

  return (
    <View style={styles.container}>
      <List.Subheader>Danh sách chủ để</List.Subheader>
      <List.Item
        style={styles.listItem}
        onPress={() => console.log('Pressed')}
        title={'Tin tức'}
        left={() => <List.Icon icon="folder" />}
        right={() => <IconButton onPress={onIconPress} icon="dots-vertical" />}
      />
      <List.Item
        style={styles.listItem}
        onPress={() => console.log('Pressed')}
        title={'Tin tức'}
        left={() => <List.Icon icon="folder" />}
        right={() => <IconButton onPress={onIconPress} icon="dots-vertical" />}
      />

      <Menu visible={showMenu} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={() => {
            showDialogUpdate();
            closeMenu();
          }}
          title="Sửa"
        />
        <Menu.Item
          onPress={() => {
            showDialogDelete();
            closeMenu();
          }}
          title="Xóa"
        />
      </Menu>
      <IconButton
        style={styles.addButton}
        icon="plus"
        onPress={() => {
          showDialogAdd();
        }}
      />

      <Portal>
        <Dialog visible={visibleDelete} onDismiss={hideDialogDelete}>
          <Dialog.Content>
            <Paragraph>Bạn có muốn xóa chủ để này ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
            <Button onPress={hideDialogDelete}>Hủy</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={visibleAdd} onDismiss={hideDialogAdd}>
          <Dialog.Content>
            <Paragraph>Thêm chủ để</Paragraph>
            <TextInput
              label="Tên chủ đề"
              returnKeyType="next"
              value={topicName.value}
              onChangeText={(text) => setTopicName({ value: text, error: '' })}
              error={!!topicName.error}
              errorText={topicName.error}
              autoCapitalize="none"
              autoCompleteType="topicName"
              textContentType="topicName"
              keyboardType="topicName"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
            <Button onPress={hideDialogAdd}>Hủy</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={visibleUpdate} onDismiss={hideDialogUpdate}>
          <Dialog.Content>
            <Paragraph>Sửa chủ đề</Paragraph>
            <TextInput
              label="Tên chủ đề"
              returnKeyType="next"
              value={topicName.value}
              onChangeText={(text) => setTopicName({ value: text, error: '' })}
              error={!!topicName.error}
              errorText={topicName.error}
              autoCapitalize="none"
              autoCompleteType="topicName"
              textContentType="topicName"
              keyboardType="topicName"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => console.log('Ok')}>Xác nhận</Button>
            <Button onPress={hideDialogUpdate}>Hủy</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
