import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CreateDiaryDialog from '../components/dialogs/CreateDiaryDialog';
import DiaryList from '../components/diary/DiaryList';
import CustomDiaryList from '../components/diary/CustomDiaryList';
import { diaryListType } from '../constants/diaryStatus';
import SharedDiaryList from '../components/diary/SharedDiaryList';

const DiaryListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  console.log(topic);
  const dispatch = useDispatch();

  const renderSwitch = (topic) => {
    switch (topic) {
      case diaryListType.favorite:
        return <CustomDiaryList topic={topic} navigation={navigation} />;
      case diaryListType.shared:
        return <CustomDiaryList topic={topic} navigation={navigation} />;
      case diaryListType.public:
        return <SharedDiaryList />
      default:
        return (
          <>
            <DiaryList topic={topic} navigation={navigation} />
            <CreateDiaryDialog topic={topic} navigation={navigation} />
          </>
        );
    }
  };

  return <View style={styles.container}>{renderSwitch(topic)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiaryListScreen;
