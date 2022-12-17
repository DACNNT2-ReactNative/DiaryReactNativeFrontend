import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useDispatch } from 'react-redux';
import { actions as diaryActions } from '../redux/diary/slice';
import { actions as topicActions } from '../redux/topic/slice';
import DiaryEdit from '../screen/DiaryEdit';
import DiaryList from '../screen/DiaryListScreen';
import DiaryOption from '../screen/DiaryOption';
import Home from '../screen/Home';
import Setting from '../screen/Setting';
import TopicOption from '../screen/TopicOption';

const Stack = createSharedElementStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const MainStackNavigator = () => {
  const dispatch = useDispatch();

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        cardStyleInterpolator: forFade,
        headerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        options={({ navigation }) => ({
          title: 'Chủ đề',
          unmountOnBlur: true,
          headerLeft: () => (
            <IconButton
              style={styles.settingButton}
              icon="account-settings"
              onPress={() => {
                navigation.navigate('Setting');
              }}
            />
          ),
          headerRight: () => (
            <IconButton
              style={styles.plusButton}
              icon="plus"
              onPress={() => {
                dispatch(topicActions.setAddTopicDialogVisible(true));
              }}
            />
          ),
        })}
        component={Home}
      />
      <Stack.Screen
        name="TopicOption"
        options={{
          headerShown: false,
          title: '',
          headerLeft: () => {
            return null;
          },
          cardStyleInterpolator: forFade,
        }}
        component={TopicOption}
        sharedElements={(route) => {
          return [route.params.topic.topicId];
        }}
      />
      <Stack.Screen
        name="Setting"
        options={{ title: 'Thông tin cá nhân', unmountOnBlur: true }}
        component={Setting}
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
        name="DiaryOption"
        options={{
          headerShown: false,
          title: '',
          headerLeft: () => {
            return null;
          },
          cardStyleInterpolator: forFade,
        }}
        component={DiaryOption}
        sharedElements={(route) => {
          return [route.params.diary.diaryId];
        }}
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
  addButton: {
    width: 35,
    height: 35,
    backgroundColor: '#ffffff',
    marginRight: 15,
  },
  settingButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    marginLeft: 15,
  },
  plusButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    marginRight: 15,
  },
});

export default MainStackNavigator;
