import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CreateDiaryDialog from '../components/dialogs/CreateDiaryDialog';
import DiaryList from '../components/diary/DiaryList';
import FavoriteDiaryList from '../components/diary/FavoriteDiaryList';

const DiaryListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  console.log(topic);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {topic ? (
        <>
          <DiaryList topic={topic} navigation={navigation} />
          <CreateDiaryDialog topic={topic} navigation={navigation} />
        </>
      ) : (
        <FavoriteDiaryList navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiaryListScreen;
