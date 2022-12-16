import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CreateDiaryDialog from '../components/dialogs/CreateDiaryDialog';
import DiaryList from '../components/diary/DiaryList';


const DiaryListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  console.log(topic);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>      
      <DiaryList topic={topic} />
      <CreateDiaryDialog topic={topic} navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiaryListScreen;
