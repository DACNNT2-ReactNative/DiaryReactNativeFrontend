import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';

import Home from '../screen/Home';
import Setting from '../screen/Setting';
import Login from '../screen/Login';
import { getAccessToken } from '../utils/token-config';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '../redux/authenticate/slice';
import { authenticationSelectors } from '../redux/authenticate/selector';
import axiosConfig from '../utils/axios';
import Register from '../screen/Register';
import Loading from '../components/Loading';
import { StyleSheet, View } from 'react-native';
import { theme } from '../core/theme';
import { useDecodeToken } from '../hooks/useDecodeToken';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Setting') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerTitleAlign: 'center',
          })}
        >
          <Tab.Screen name="Home" options={{ title: 'Trang chủ', unmountOnBlur: true }} component={Home} />
          <Tab.Screen name="Setting" options={{ title: 'Cài đặt' }} component={Setting} />
        </Tab.Navigator>
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
