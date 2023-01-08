import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceToken = 'deviceToken';
export const setDeviceToken = async (token) => {
    await AsyncStorage.setItem(deviceToken, token);
};
export const getDeviceToken = async () => {
    return await AsyncStorage.getItem(deviceToken);
};
export const removeDeviceToken = async () => {
    await AsyncStorage.removeItem(deviceToken);
};
