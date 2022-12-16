import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';

import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { theme } from '../core/theme';
import { useDecodeToken } from '../hooks/useDecodeToken';
import { authenticationSelectors } from '../redux/authenticate/selector';
import Home from '../screen/Home';
import Login from '../screen/Login';
import Register from '../screen/Register';
import Setting from '../screen/Setting';
import MainStackNavigator from './MainStack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const Tab = createBottomTabNavigator();
const Stack = createSharedElementStackNavigator();

function AppNavigation() {
  const isAuthenticated = useSelector(authenticationSelectors.isUserAuthenticated);

  const isDecodingToken = useDecodeToken();

  if (isDecodingToken) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {isAuthenticated && !isDecodingToken ? (
        <MainStackNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { AppNavigation, AuthContext };
