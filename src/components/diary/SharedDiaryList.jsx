import { useIsFocused } from '@react-navigation/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Divider, Paragraph } from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { iconDiaryList } from '../../constants/iconDiaryList';
import { diarySelectors } from '../../redux/diary/selector';
import { actions as diaryActions } from '../../redux/diary/slice';
import axiosConfig from '../../utils/axios';
import Loading from '../Loading';

const screen = Dimensions.get('screen');

const SharedDiaryList = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const diaries = useSelector(diarySelectors.getDiaries);
  const [richTextDisable, setRichTextDisable] = useState(false);

  //console.log('get diaries', diaries);

  const {
    data: diaryList,
    isLoading: isGettingDiaries,
    refetch,
  } = useQuery(
    ['diariesPublic'],
    async () => {
      const response = await axiosConfig.get('Diary/get-public-diaries');
      return response.data;
    },
    {
      onError: () => {
        console.log('error get public topics');
      },
    },
  );

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  useEffect(() => {
    if (diaryList) {
      dispatch(diaryActions.setDiaries(diaryList));
    }
  }, [diaryList]);

  if (isGettingDiaries) {
    return (
      <View style={styles.loading}>
        <Loading />
      </View>
    );
  }

  const iconSwitch = (diaryType) => {
    switch (diaryType) {
      case iconDiaryList.happy:
        return (
          <>
            vui vẻ <Image source={require('../../assets/happy.png')} style={styles.iconImages} />
          </>
        );
      case iconDiaryList.sad:
        return (
          <>
            buồn <Image source={require('../../assets/sad.png')} style={styles.iconImages} />
          </>
        );
      case iconDiaryList.surprise:
        return (
          <>
            bất ngờ{' '}
            <Image source={require('../../assets/surprise.png')} style={styles.iconImages} />
          </>
        );
      case iconDiaryList.fear:
        return (
          <>
            sợ hãi <Image source={require('../../assets/fear.png')} style={styles.iconImages} />
          </>
        );
      default:
        return '';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.diary}>
      <Paragraph style={styles.name}>
        {item.userFullName ? item.userFullName : 'Ẩn danh'}
        <Paragraph style={styles.textAfterName}> đang cảm thấy {iconSwitch(item.type)}</Paragraph>
      </Paragraph>
      <Divider />
      <ScrollView nestedScrollEnabled={true} style={styles.content}>
        <RichEditor
          useContainer={true}
          androidHardwareAccelerationDisabled={true}
          disabled={richTextDisable}
          scrollEnabled={true}
          editorInitializedCallback={() => setRichTextDisable(true)}
          editorStyle={{
            backgroundColor: 'white',
          }}
          initialContentHTML={item.content}
          initialHeight={screen.height - screen.width}
        />
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      nestedScrollEnabled={true}
      data={diaries}
      keyExtractor={(item) => item.diaryId}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    height: screen.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diary: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  name: {
    marginBottom: 10,
    fontSize: 18,
  },
  textAfterName: {
    fontSize: 12,
  },
  content: {
    marginTop: 5,
  },
  iconImages: {
    height: 15,
    width: 15,
    resizeMode: 'cover',
  },
});

export default SharedDiaryList;
