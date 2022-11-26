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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppNavigation() {
  // const [state, dispatch] = React.useReducer(
  //   (prevState, action) => {
  //     switch (action.type) {
  //       case "RESTORE_TOKEN":
  //         return {
  //           ...prevState,
  //           userToken: action.token,
  //           isLoading: false,
  //         };
  //       case "SIGN_IN":
  //         return {
  //           ...prevState,
  //           isSignout: false,
  //           userToken: action.token,
  //         };
  //       case "SIGN_OUT":
  //         return {
  //           ...prevState,
  //           isSignout: true,
  //           userToken: null,
  //         };
  //     }
  //   },
  //   {
  //     isLoading: true,
  //     isSignout: false,
  //     userToken: null,
  //   },
  // );

  // React.useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     let userToken;

  //     try {
  //       userToken = await AsyncStorage.getItem("userToken");
  //     } catch (e) {}
  //     dispatch({ type: "RESTORE_TOKEN", token: userToken });
  //   };

  //   bootstrapAsync();
  // }, []);

  // const authContext = React.useMemo(
  //   () => ({
  //     signIn: async (data) => {
  //       await AsyncStorage.setItem("userToken", data.username.value);
  //       dispatch({ type: "SIGN_IN", token: data.username.value });
  //     },
  //     signOut: () => dispatch({ type: "SIGN_OUT" }),
  //     signUp: async (data) => {
  //       dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
  //     },
  //   }),
  //   [],
  // );
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authenticationSelectors.isUserAuthenticated);

  const { data: currentUser, isLoading: isDecodingToken } = useQuery(
    ['decodeToken'],
    async () => {
      let accessToken = '';
      const token = await getAccessToken();
      if (token) {
        accessToken = token;
      }
      const response = await axiosConfig.get('Authenticate/decode-token', { headers: { jwttoken: accessToken } });
      dispatch(authActions.setAuthenticated(true));
      return response.data;
    },
    {
      onError: () => {
        dispatch(authActions.setAuthenticated(false));
        console.log('error decode token');
      },
    },
  );

  console.log('user', currentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(authActions.setUser(currentUser));
    }
  }, [currentUser]);

  if (isDecodingToken) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {/* <AuthContext.Provider value={authContext}> */}
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
          <Tab.Screen name="Home" options={{ title: 'Trang chủ' }} component={Home} />
          <Tab.Screen name="Setting" options={{ title: 'Cài đặt' }} component={Setting} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
      {/* </AuthContext.Provider> */}
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
