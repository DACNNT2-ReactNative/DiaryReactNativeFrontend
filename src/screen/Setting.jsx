import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { removeAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';
import { useDispatch } from 'react-redux';

function Setting() {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Setting Screen</Text>
      <Button
        mode="contained"
        onPress={() => {
          removeAccessToken();
          dispatch(authActions.setAuthenticated(false))
        }}
      >Logout</Button>
    </View>
  );
}

export default Setting;
