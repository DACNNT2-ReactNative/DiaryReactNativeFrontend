import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { passwordValidator } from '../helpers/passwordValidator';
import { authenticationSelectors } from '../redux/authenticate/selector';
import axiosConfig from '../utils/axios';
import { actions as authActions } from '../redux/authenticate/slice';
import { useMutation } from 'react-query';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = React.useState({ value: '', error: '' });
  const [newPassword, setNewPassword] = React.useState({ value: '', error: '' });
  const [reNewPassword, setReNewPassword] = React.useState({ value: '', error: '' });

  const dispatch = useDispatch();

  const currentUser = useSelector(authenticationSelectors.getCurrentUser);

  const onChangePasswordPress = async () => {
    const oldPasswordError = passwordValidator(oldPassword.value);
    const newPasswordError = passwordValidator(newPassword.value);
    if (newPassword.value !== reNewPassword.value) {
      setReNewPassword({ value: reNewPassword.value, error: 'Mật khẩu không khớp' });
      return;
    }
    if (oldPasswordError || newPasswordError) {
      setOldPassword({ value: oldPassword.value, error: oldPasswordError });
      setNewPassword({ value: newPassword.value, error: newPasswordError });
      return;
    }
    changePassword({
      userId: currentUser.userId,
      password: newPassword.value,
    });
  };

  const { mutate: changePassword, isLoading } = useMutation(
    (data) => {
      return axiosConfig.put('Authenticate/update-user', data);
    },
    {
      onSuccess: async (response) => {
        dispatch(authActions.setAuthenticated(false));
        dispatch(authActions.setUser(undefined));
      },
      onError: (error) => {
        dispatch(authActions.setAuthenticated(false));
        dispatch(authActions.setUser(undefined));
      },
    },
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Mật khẩu cũ"
        returnKeyType="next"
        value={oldPassword.value}
        onChangeText={(text) => setOldPassword({ value: text, error: '' })}
        error={!!oldPassword.error}
        errorText={oldPassword.error}
        autoCapitalize="none"
        autoCompleteType="oldPassword"
        textContentType="oldPassword"
        keyboardType="oldPassword"
        secureTextEntry
      />
      <TextInput
        label="Mật khẩu mới"
        returnKeyType="next"
        value={newPassword.value}
        onChangeText={(text) => setNewPassword({ value: text, error: '' })}
        error={!!newPassword.error}
        errorText={newPassword.error}
        autoCapitalize="none"
        autoCompleteType="newPassword"
        textContentType="newPassword"
        keyboardType="newPassword"
        secureTextEntry
      />
      <TextInput
        label="Nhập lại mật khẩu mới"
        returnKeyType="next"
        value={reNewPassword.value}
        onChangeText={(text) => setReNewPassword({ value: text, error: '' })}
        error={!!reNewPassword.error}
        errorText={reNewPassword.error}
        autoCapitalize="none"
        autoCompleteType="reNewPassword"
        textContentType="reNewPassword"
        keyboardType="reNewPassword"
        secureTextEntry
      />
      <Button mode="contained" onPress={onChangePasswordPress} loading={isLoading}>
        Đổi mật khẩu
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ChangePassword;
