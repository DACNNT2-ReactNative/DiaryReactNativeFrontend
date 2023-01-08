import { registerRootComponent } from 'expo';
import App from './App';
import messaging from '@react-native-firebase/messaging';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', JSON.stringify(remoteMessage));
});

registerRootComponent(App);