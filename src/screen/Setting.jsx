import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { removeAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';
import { actions as diaryActions } from '../redux/diary/slice';
import { useDispatch, useSelector } from 'react-redux';
import { diaryListType } from '../constants/diaryStatus';
import { useIsFocused } from '@react-navigation/core';
import { useEffect } from 'react';
import { getDeviceToken } from '../utils/deviceTokenConfig';
import axiosConfig from '../utils/axios';
import { authenticationSelectors } from '../redux/authenticate/selector';

function Setting({ route, navigation }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const isFocused = useIsFocused();
  const onLogoutPressed = async () => {
    await removeDeviceToken();
    dispatch(authActions.setAuthenticated(false));
    dispatch(authActions.setUser(undefined));
  };

  const removeDeviceToken = async () => {
    const deviceToken = await getDeviceToken();
    console.log('deviceToken', deviceToken);
    await axiosConfig.post('Device/delete-device', {
      userId: currentUser.userId,
      deviceToken: deviceToken,
    });
    await removeAccessToken();
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(diaryActions.setDiaries([]));
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
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
      {currentUser.typeLogin === 'username' && (
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('PassCode');
          }}
        >
          Mã bảo mật
        </Button>
      )}

      {currentUser.typeLogin === 'username' && (
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('ChangePassword');
          }}
        >
          Đổi mật khẩu
        </Button>
      )}

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
