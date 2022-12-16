import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Dimensions } from 'react-native';
import { View } from 'react-native';
import { StyleSheet, ScrollView } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useMutation, useQuery } from 'react-query';
import { useEffect } from 'react';
import { actions as diaryActions } from '../../redux/diary/slice';
import { diarySelectors } from '../../redux/diary/selector';
import Loading from '../Loading';
import axiosConfig from '../../utils/axios';
import { TouchableOpacity } from 'react-native';

const screen = Dimensions.get('screen');

const DiaryList = (props) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const diaries = useSelector(diarySelectors.getDiaries);

  const {
    data: diaryList,
    isLoading: isGettingDiaries,
    refetch,
  } = useQuery(
    ['diaries'],
    async () => {
      const response = await axiosConfig.get('Diary/get-diaries-by-topic-id', {
        params: { topicId: props.topic.topicId },
      });
      console.log('get diaries res', response.data);
      return response.data;
    },
    {
      onError: () => {
        console.log('error get topics');
      },
    },
  );

  console.log('get diaries', diaryList);

  useEffect(() => {
    if (isFocused) {
      refetch();
      diaries.map((diary) => {
        setTimeout(() => {
          if(!diary.content || diary.content === ''){
            dispatch(diaryActions.removeDiaryFromList(diary));
          }
        }, 800);      
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (diaryList && isFocused) {
      console.log('list', diaryList);
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

  const source = {
    html: '',
  };

  const WebDisplay = React.memo(function WebDisplay({ content }) {
    const tagsStyles = {
      body: {
        whiteSpace: 'normal',
        color: 'gray',
      },
      div: {
        fontSize: '8px',
      }
    };
    return <RenderHTML contentWidth={width} source={{ html: content }} tagsStyles={tagsStyles} />;
  });

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {diaries.map((diary) => (
        <TouchableOpacity key={diary.diaryId} style={styles.listItem}>
          <WebDisplay content={diary.content ? diary.content : source.html} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    height: screen.height,
  },
  listItem: {
    height: (screen.width - 80) / 3,
    width: (screen.width - 80) / 3,
    margin: 10,
    backgroundColor: '#fbead1',
    borderRadius: 7,
    padding: 10,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'flex-start',
    marginTop: 50,
  },
});

export default DiaryList;
