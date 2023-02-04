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
import { Divider, List, Paragraph } from 'react-native-paper';

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

  console.log(currentUser);
  useEffect(() => {
    if (isFocused) {
      dispatch(diaryActions.setDiaries([]));
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row' }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#ffffff',
            marginRight: 10,
          }}
        >
          <List.Icon style={{ transform: [{ scale: 1.5 }] }} icon="account" />
        </View>
        <Paragraph style={{ fontSize: 20, alignItems: 'center' }}>{currentUser.fullName}</Paragraph>
      </View>

      <View style={{ padding: 20, backgroundColor: '#c3c3c3', borderRadius: 5 }}>
        <Paragraph style={{ fontSize: 18, alignItems: 'center' }}>Tài khoản</Paragraph>
      </View>
      <List.Item
        title="Mã bảo mật"
        onPress={() => {
          navigation.navigate('PassCode');
        }}
        left={() => (
          <View
            style={{
              backgroundColor: '#7ade45',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#7ade45',
              transform: [{ scale: 0.7 }],
            }}
          >
            <List.Icon icon="key-variant" color="white" />
          </View>
        )}
        right={() => <List.Icon icon="chevron-right" />}
        titleStyle={{ fontSize: 18 }}
      />
      {currentUser.typeLogin === 'username' && (
        <>
          <Divider />
          <List.Item
            title="Đổi mật khẩu"
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}
            left={() => (
              <View
                style={{
                  backgroundColor: '#9f46df',
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: '#9f46df',
                  transform: [{ scale: 0.7 }],
                }}
              >
                <List.Icon icon="account-key" color="white" />
              </View>
            )}
            right={() => <List.Icon icon="chevron-right" />}
            titleStyle={{ fontSize: 18 }}
          />
        </>
      )}
      <View style={{ padding: 20, backgroundColor: '#c3c3c3', borderRadius: 5 }}>
        <Paragraph style={{ fontSize: 18, alignItems: 'center' }}>Khác</Paragraph>
      </View>
      <List.Item
        title="Nhật ký yêu thích"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.favorite });
        }}
        left={() => (
          <View
            style={{
              backgroundColor: '#df465a',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#df465a',
              transform: [{ scale: 0.7 }],
            }}
          >
            <List.Icon icon="heart" color="white" />
          </View>
        )}
        right={() => <List.Icon icon="chevron-right" />}
        titleStyle={{ fontSize: 18 }}
      />
      <Divider />
      <List.Item
        title="Nhật ký đã chia sẻ"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.shared });
        }}
        left={() => (
          <View
            style={{
              backgroundColor: '#5046df',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#5046df',
              transform: [{ scale: 0.7 }],
            }}
          >
            <List.Icon icon="share" color="white" />
          </View>
        )}
        right={() => <List.Icon icon="chevron-right" />}
        titleStyle={{ fontSize: 18 }}
      />
      <Divider />
      <List.Item
        title="Cộng đồng"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: diaryListType.public });
        }}
        left={() => (
          <View
            style={{
              backgroundColor: '#ec6749',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#ec6749',
              transform: [{ scale: 0.7 }],
            }}
          >
            <List.Icon icon="account-multiple" color="white" />
          </View>
        )}
        right={() => <List.Icon icon="chevron-right" />}
        titleStyle={{ fontSize: 18 }}
      />
      <Divider />
      <Divider />
      <List.Item
        title="Đăng xuất"
        onPress={() => {
          onLogoutPressed();
        }}
        left={() => (
          <View
            style={{
              backgroundColor: '#ee2626',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#ee2626',
              transform: [{ scale: 0.7 }],
            }}
          >
            <List.Icon icon="logout" color="white" />
          </View>
        )}
        right={() => <List.Icon icon="chevron-right" />}
        titleStyle={{ fontSize: 18 }}
      />
      <Divider />
    </View>
  );
}

export default Setting;
