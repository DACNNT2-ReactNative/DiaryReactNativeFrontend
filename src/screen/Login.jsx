import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { passwordValidator } from "../helpers/passwordValidator";
import { usernameValidator } from "../helpers/usernameValidator";
import { useDispatch } from "react-redux";
import { actions as authActions } from "../redux/authenticate/slice";

import axiosConfig from "../utils/axios";

export default function Login({ navigation }) {
  const dispatch = useDispatch();  
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

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
    }
    const response = axiosConfig.post('Authenticate/login', data)
    response.then(data => {
      console.log(data);
    })
    dispatch(authActions.setAuthenticated(true));
  };

  return (
    <Background>
      <Logo />
      <Header>Nhật ký</Header>
      <TextInput
        label="Tên đăng nhập"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
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
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button mode="contained" onPress={onLoginPressed}>
        Đăng nhập
      </Button>
      <View style={styles.row}>
        <Text>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Register")}>
          <Text style={styles.link}>Đăng kí</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  appTitle: {
    color: theme.colors.primary,
  }
});
