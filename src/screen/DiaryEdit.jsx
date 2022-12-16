import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RichTextEditor from '../components/diary/RichTextEditor';
import { actions as diaryActions } from '../redux/diary/slice';

const DiaryEdit = ({ route, navigation }) => {
  const { diary } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('dispatch');
    dispatch(diaryActions.setCurrentEditingDiary(diary));
  },[])

  return <RichTextEditor diary={diary} navigation={navigation} />;
};

export default DiaryEdit;
