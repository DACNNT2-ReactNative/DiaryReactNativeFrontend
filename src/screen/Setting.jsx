import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { removeAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';
import { useDispatch } from 'react-redux';

function Setting({ route, navigation }) {
  const dispatch = useDispatch();
  const onLogoutPressed = async () => {
    await removeAccessToken();
    dispatch(authActions.setAuthenticated(false));
    dispatch(authActions.setUser(undefined));
  };
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text>Setting Screen</Text>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate('DiaryList', { topic: null });
        }}
      >
        Nhật ký yêu thích
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
