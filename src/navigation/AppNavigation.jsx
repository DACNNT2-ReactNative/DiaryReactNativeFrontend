import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
          initialRouteName="HomeTab"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeTab') {
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
          <Tab.Screen name="HomeTab" options={{ title: 'Trang chủ' ,headerShown: false }} component={MainStackNavigator} />
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

