import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/configs/configureStore";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/utils/query-client";
import * as Linking from 'expo-linking';


export default function App() {
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
