import React from 'react';
import { Alert } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useMutation } from 'react-query';
import Background from '../components/Background';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { usernameValidator } from '../helpers/usernameValidator';
import axiosConfig from '../utils/axios';

function ForgotPassword({ navigation }) {
  const [username, setUsername] = React.useState({ value: '', error: '' });

  const onForgotPasswordPressed = async () => {
    const usernameError = usernameValidator(username.value);
    if (usernameError) {
      setUsername({ ...username, error: usernameError });
      return;
    }
    forgotPassword({ username: username.value });
  };

  const { mutate: forgotPassword, isLoading } = useMutation(
    (data) => {
      return axiosConfig.post('Authenticate/forgot-password', data);
    },
    {
      onSuccess: async (response) => {
        Alert.alert('Thông báo', 'Vui lòng kiểm tra email để lấy lại mật khẩu');
        navigation.navigate('Login');
      },
      onError: (error) => {
        Alert.alert('Lỗi', error);
      },
    },
  );

  return (
    <Background
      children={
        <>
          <View style={styles.headers}>
            <Text style={styles.texHeader}>Quên mật khẩu</Text>
            <Text style={styles.title}>Vui lòng nhập tên đăng nhập.</Text>
          </View>
          <TextInput
            label="Tên đăng nhập"
            returnKeyType="next"
            value={username.value}
            onChangeText={(text) => setUsername({ value: text, error: '' })}
            error={!!username.error}
            errorText={username.error}
            autoCapitalize="none"
            autoCompleteType="username"
            textContentType="username"
            keyboardType="username"
          />
          <Button mode="contained" onPress={onForgotPasswordPressed} loading={isLoading}>
            Gửi
          </Button>

          <View style={styles.row}>
            <Text>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.link}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </>
      }
    ></Background>
  );
}

const styles = StyleSheet.create({
  headers: {
    marginBottom: 20,
    top: 0,
    justifyContent: 'center',
  },
  texHeader: {
    fontSize: 24,
    color: '#5A7EFE',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    top: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  appTitle: {
    color: theme.colors.primary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default ForgotPassword;
