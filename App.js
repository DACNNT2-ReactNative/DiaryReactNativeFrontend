import { StatusBar } from "expo-status-bar";
import { AppNavigation } from "./src/navigation/AppNavigation";
import { Provider } from "react-native-paper";
import { theme } from "./src/core/theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/configs/configureStore";

export default function App() {
  return (
    <Provider theme={theme}>
      <StatusBar backgroundColor="#E9ECF2" barStyle="dark-content" />
      <ReduxProvider store={store}>
        <AppNavigation />
      </ReduxProvider>
    </Provider>
  );
}
