import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { removeAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';
import { actions as diaryActions } from '../redux/diary/slice';
import { useDispatch } from 'react-redux';
import { diaryListType } from '../constants/diaryStatus';
import { useIsFocused } from '@react-navigation/core';
import { useEffect } from 'react';

function Setting({ route, navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const onLogoutPressed = async () => {
    await removeAccessToken();
    dispatch(authActions.setAuthenticated(false));
    dispatch(authActions.setUser(undefined));
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(diaryActions.setDiaries([]));
    }
  }, [isFocused]);
  
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text>Setting Screen</Text>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.favorite });
        }}
      >
        Nhật ký yêu thích
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.shared });
        }}
      >
        Nhật ký đã chia sẻ
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('PassCode');
        }}
      >
        Mã bảo mật
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.public });
        }}
      >
        Cộng đồng
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          onLogoutPressed();
        }}
      >
        Logout
      </Button>
    </View>
  );
}

export default Setting;
