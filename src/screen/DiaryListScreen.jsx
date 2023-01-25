import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import CreateDiaryDialog from '../components/dialogs/CreateDiaryDialog';
import DiaryList from '../components/diary/DiaryList';
import CustomDiaryList from '../components/diary/CustomDiaryList';
import { diaryListType } from '../constants/diaryStatus';
import SharedDiaryList from '../components/diary/SharedDiaryList';
import TextInput from '../components/TextInput';

const DiaryListScreen = ({ route, navigation }) => {
  const { topic } = route.params;
  const [searchKey, setSearchKey] = useState({ value: '', error: '' });
  const dispatch = useDispatch();

  const renderDiaryList = (topic) => {
    switch (topic) {
      case diaryListType.favorite:
        return (
          <CustomDiaryList searchKey={searchKey.value} topic={topic} navigation={navigation} />
        );
      case diaryListType.shared:
        return (
          <CustomDiaryList searchKey={searchKey.value} topic={topic} navigation={navigation} />
        );
      case diaryListType.public:
        return <SharedDiaryList />;
      default:
        return (
          <>
            <DiaryList topic={topic} searchKey={searchKey.value} navigation={navigation} />
            <CreateDiaryDialog topic={topic} navigation={navigation} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {topic !== diaryListType.public && (
        <TextInput
          returnKeyType="next"
          value={searchKey.value}
          onChangeText={(text) => setSearchKey({ value: text, error: '' })}
          autoCapitalize="none"
          style={{ margin: 10, width: '90%', alignSelf: 'center', height: 40 }}
        />
      )}
      {renderDiaryList(topic)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DiaryListScreen;
