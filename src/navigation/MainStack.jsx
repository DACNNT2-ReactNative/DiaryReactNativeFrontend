import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DiaryEdit from '../screen/DiaryEdit';
import DiaryList from '../screen/DiaryList';
import Home from '../screen/Home';

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#ea65cb',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{ title: 'Chủ đề', unmountOnBlur: true }}
        component={Home}
      />
      <Stack.Screen
        name="DiaryList"
        options={{ title: 'Nhật ký', unmountOnBlur: true }}
        component={DiaryList}
      />
      <Stack.Screen
        name="DiaryEdit"
        options={{ title: 'Viết nhật ký' }}
        component={DiaryEdit}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
