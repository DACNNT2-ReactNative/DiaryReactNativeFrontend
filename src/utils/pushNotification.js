import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

export async function getFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    } else {
        console.log('Failed', 'No token received');
    }
}