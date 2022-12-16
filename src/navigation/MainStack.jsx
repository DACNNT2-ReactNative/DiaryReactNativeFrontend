import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { actions as diaryActions } from '../redux/diary/slice';
import DiaryEdit from '../screen/DiaryEdit';
import DiaryList from '../screen/DiaryListScreen';
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
  const dispatch = useDispatch();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{ title: 'Chủ đề', unmountOnBlur: true }}
        component={Home}
      />
      <Stack.Screen
        name="DiaryList"
        options={{
          title: 'Nhật ký',
          unmountOnBlur: true,
          headerRight: () => (
            <IconButton
              style={styles.addButton}
              icon="file-document-edit-outline"
              onPress={() => {
                dispatch(diaryActions.setCreateDiaryDialogVisible(true));
              }}
            />
          ),
        }}
        component={DiaryList}
      />
      <Stack.Screen
        name="DiaryEdit"
        options={{
          title: 'Viết nhật ký',
        }}
        component={DiaryEdit}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
  },
  addButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
  },
});

export default MainStackNavigator;
