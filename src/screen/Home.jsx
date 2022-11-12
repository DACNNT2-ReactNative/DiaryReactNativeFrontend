import React from 'react';
import Header from '../components/Header';
import { View, Text } from 'react-native';
import Button from '../components/Button';
import { authenticationSelectors } from '../redux/authenticate/selector';
import { useDispatch, useSelector } from 'react-redux';
import { removeAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';

function Home() {
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Header />
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={() => {
          removeAccessToken();
          dispatch(authActions.setAuthenticated(false));
        }}
      >
        Logout
      </Button>
    </View>
  );
}

export default Home;
