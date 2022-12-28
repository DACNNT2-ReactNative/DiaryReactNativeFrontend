import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { Text, HelperText, IconButton, Portal, Dialog, Paragraph } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { passwordValidator } from '../helpers/passwordValidator';
import { usernameValidator } from '../helpers/usernameValidator';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../redux/authenticate/slice';
import axiosConfig from '../utils/axios';
import { useMutation } from 'react-query';
import { setAccessToken } from '../utils/token-config';
import Loading from '../components/Loading';
import * as Google from 'expo-auth-session/providers/google';
import { passCodeValidator } from '../helpers/passCodeValidator';

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [passCode, setPassCode] = useState({ value: '', error: '' });
  const [isSecure, setIsSecure] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '556329648016-t8h951d4t6jnbctfkk0ikm7cs9cuavsa.apps.googleusercontent.com',
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  });

  const { mutate: loginUser, isLoading } = useMutation(
    (loginData) => {
      return axiosConfig.post('Authenticate/login', loginData);
    },
    {
      onSuccess: async (response) => {
        await setAccessToken(response.data.token);
        const responseUser = await axiosConfig.get('Authenticate/decode-token', {
          headers: { jwttoken: response.data.token },
        });
        dispatch(authActions.setUser(responseUser.data));
        dispatch(authActions.setAuthenticated(true));
      },
      onError: (error) => {
        console.log('error login', error);
        if (error.status === 400) {
          setIsSecure(true);
        } else if (error.title) {
          Alert.alert('', error.title);
        } else {
          Alert.alert('', error);
        }
      },
    },
  );

  const onLoginPressed = () => {
    const userNameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    if (userNameError || passwordError) {
      setUsername({ ...username, error: userNameError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    const data = {
      username: username.value,
      password: password.value,
    };
    loginUser(data);
  };

  const onLoginWithPassCodePress = () => {
    const userNameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    const passCodeError = passCodeValidator(passCode.value);
    if (userNameError || passwordError || passCodeError) {
      setUsername({ ...username, error: userNameError });
      setPassword({ ...password, error: passwordError });
      setPassCode({ ...passCode, error: passCodeError });
      return;
    }
    const data = {
      username: username.value,
      password: password.value,
      passCode: passCode.value,
    };
    loginUser(data);
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('authentication', authentication);
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  return (
    <Background
      children={
        <>
          {isSecure ? (
            <Portal>
              <Dialog
                style={styles.dialog}
                visible={true}
                onDismiss={() => {
                  setIsSecure(false);
                }}
              >
                <Dialog.Content>
                  <View style={styles.content}>
                    <Paragraph>Nhập mã bảo mật</Paragraph>
                    <TextInput
                      secureTextEntry
                      label="Mã bảo mật"
                      returnKeyType="next"
                      value={passCode.value}
                      onChangeText={(text) => setPassCode({ value: text, error: '' })}
                      autoCapitalize="none"
                      error={!!passCode.error}
                      errorText={passCode.error}
                      autoCompleteType="passCode"
                      textContentType="passCode"
                      keyboardType="passCode"
                    />
                  </View>
                </Dialog.Content>
                <Dialog.Actions>
                  <View style={styles.actions}>
                    <View style={styles.button}>
                      <Button
                        mode="contained"
                        loading={isLoading}
                        onPress={onLoginWithPassCodePress}
                      >
                        Xác nhận
                      </Button>
                    </View>
                  </View>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          ) : (
            ''
          )}
          <View style={styles.headers}>
            <Text style={styles.texHeader}>Chào mừng trở lại</Text>
            <Text style={styles.title}>
              Chúng tôi rất vui được gặp lại bạn. Để sử dụng tài khoản của bạn, bạn nên đăng nhập
              đầu tiên.
            </Text>
          </View>
          <Header>Đăng nhập</Header>
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
          <TextInput
            label="Mật khẩu"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          {error ? <HelperText type="error">{error}</HelperText> : null}
          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.forgot}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed} loading={isLoading}>
            Đăng nhập
          </Button>

          <Text
            style={{
              marginTop: 20,
            }}
          >
            Hoặc
          </Text>
          <Text
            style={{
              marginTop: 10,
            }}
          >
            - Đăng nhập bằng Google -
          </Text>

          <Button
            mode="contained"
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
            style={{
              backgroundColor: theme.colors.background,
              marginTop: 20,
              borderColor: '#E8F0F9',
              width: '100%',
              marginVertical: 10,
              paddingVertical: 2,
              borderRadius: 15,
            }}
            labelStyle={{
              color: '#BFBFBF',
              fontSize: 12,
            }}
          >
            Google
          </Button>

          <View style={styles.row}>
            <Text>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.link}>Đăng kí</Text>
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
    alignItems: 'flex-start',
  },
  texHeader: {
    fontSize: 24,
    color: '#5A7EFE',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    top: 10,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginRight: 40,
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row',
    marginTop: 30,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.primary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  loading: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    borderRadius: 25,
  },
  content: {
    marginBottom: -20,
  },
  actions: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    paddingBottom: 5,
  },
});
