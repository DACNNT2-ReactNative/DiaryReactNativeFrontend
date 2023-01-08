import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/configs/configureStore";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/utils/query-client";
import * as Linking from 'expo-linking';
import { useEffect } from "react";
import { Alert } from "react-native";
import messaging from '@react-native-firebase/messaging';



export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert(remoteMessage.data.title, remoteMessage.data.body);
    });

    return unsubscribe;
  }, []);
  return (
    <Provider theme={theme}>
      <StatusBar backgroundColor="#E9ECF2" barStyle="dark-content" />
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <AppNavigation />
        </ReduxProvider>
      </QueryClientProvider>
    </Provider>
  );
}
