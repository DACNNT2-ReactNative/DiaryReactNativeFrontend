import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CreateDiaryDialog from '../components/dialogs/CreateDiaryDialog';
import DiaryList from '../components/diary/DiaryList';
import { actions as diaryActions } from '../redux/diary/slice';

const DiaryListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  console.log(topic);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <IconButton
        style={styles.addButton}
        icon="plus"
        onPress={() => {
          dispatch(diaryActions.setCreateDiaryDialogVisible(true));
        }}
      />
      <DiaryList topic={topic} />
      <CreateDiaryDialog topic={topic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    zIndex: 10,
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    backgroundColor: '#f7efef',
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default DiaryListScreen;
