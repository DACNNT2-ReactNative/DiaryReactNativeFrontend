import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Background from '../components/Background';
import { HelperText } from 'react-native-paper';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { passwordValidator } from '../helpers/passwordValidator';
import { usernameValidator } from '../helpers/usernameValidator';
import { actions as authActions } from '../redux/authenticate/slice';
import axiosConfig from '../utils/axios';
import { useMutation } from 'react-query';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';

export default function Register({ navigation }) {
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [fullName, setFullName] = useState({ value: '', error: '' });
  const [error, setError] = useState('');

  const { mutate: registerUser, isLoading } = useMutation(
    (registerData) => {
      return axiosConfig.post('Authenticate/register', registerData);
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          navigation.replace('Login');
        }
      },
      onError: (error) => {
        console.log('error register', error);
        setError(error);
      },
    },
  );

  const onRegisterPress = () => {
    const userNameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    const fullNameError = usernameValidator(fullName.value);
    if (userNameError || passwordError || fullNameError) {
      setUsername({ ...username, error: userNameError });
      setPassword({ ...password, error: passwordError });
      setFullName({ ...fullName, error: fullNameError });
      return;
    }
    const data = {
      username: username.value,
      password: password.value,
      fullName: fullName.value,
    };
    registerUser(data);
  };

  return (
    <Background
      children={
        <>
          <View style={styles.headers}>
            <Text style={styles.texHeader}>Đăng kí tài khoản</Text>
            <Text style={styles.title}>Vui lòng nhập đầy đủ thông tin để đăng kí tài khoản.</Text>
          </View>
          <Header>Đăng kí</Header>
          <TextInput
            label="Họ và tên"
            returnKeyType="next"
            value={fullName.value}
            onChangeText={(text) => setFullName({ value: text, error: '' })}
            error={!!fullName.error}
            errorText={fullName.error}
            autoCapitalize="none"
            autoCompleteType="fullName"
            textContentType="fullName"
            keyboardType="fullName"
          />
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
          <Button mode="contained" onPress={onRegisterPress} loading={isLoading}>
            Đăng kí
          </Button>

          <Text
            style={{
              marginTop: 30,
            }}
          >
            ------------------- Đăng kí bằng Google ----------------
          </Text>

          <Button
            mode="contained"
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
