import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { Dialog, Divider, List, Paragraph, Portal } from 'react-native-paper';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import { Button as ButtonPaper } from 'react-native-paper';
import TextInput from '../components/TextInput';
import { passCodeValidator } from '../helpers/passCodeValidator';
import { authenticationSelectors } from '../redux/authenticate/selector';
import axiosConfig from '../utils/axios';

export default function PassCode({ route, navigation }) {
  const currentUser = useSelector(authenticationSelectors.getCurrentUser);
  const [isProtected, setIsProtected] = React.useState(false);
  const [passCode, setPassCode] = React.useState({ value: '', error: '' });
  const [isDisable, setIsDisable] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  React.useEffect(() => {
    axiosConfig.get('Authenticate/user-info?userId=' + currentUser.userId).then((res) => {
      if (res.data.isProtected) {
        setIsProtected(res.data.isProtected);
        setIsDisable(false);
      }
    });
  }, []);

  const { mutate: createPassCode, isLoading } = useMutation(
    (data) => {
      return axiosConfig.put('Authenticate/update-user', data);
    },
    {
      onSuccess: async (response) => {
        console.log(response);
        setOpen(false);
        setPassCode({ value: passCode.value, error: '' });
        setIsDisable(false);
      },
      onError: (error) => {},
    },
  );

  const { mutate: deletePassCode, isLoadingDelete } = useMutation(
    (data) => {
      return axiosConfig.put('Authenticate/update-user', data);
    },
    {
      onSuccess: async (response) => {
        console.log(response);
        setOpenDelete(false);
        setPassCode({ value: '', error: '' });
        setIsDisable(true);
      },
      onError: (error) => {},
    },
  );

  const createPassCodePress = () => {
    const passCodeError = passCodeValidator(passCode.value);
    if (passCodeError) {
      setPassCode({ ...passCode, error: passCodeError });
      return;
    }
    createPassCode({
      userId: currentUser.userId,
      passCode: passCode.value,
    });
  };

  const onDeletePassCodeAccept = () => {
    deletePassCode({
      userId: currentUser.userId,
      isProtected: false,
    });
  };

  const onDeletePassCodePress = () => {
    setOpenDelete(true);
  };

  const onCreatePassCodePress = () => {
    setOpen(true);
  };

  const styles = StyleSheet.create({
    btn: {
      width: '100%',
      height: 40,
      marginVertical: 2,
      display: 'flex',
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
    buttonDelete: {
      width: '50%',
      paddingBottom: 5,
    },
  });

  return (
    <View>
      {openDelete && (
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={true}
            onDismiss={() => {
              setOpenDelete(false);
            }}
          >
            <Dialog.Content>
              <View style={styles.content}>
                <Paragraph>Bạn có muốn xóa mã bảo mật ?</Paragraph>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <View style={styles.actions}>
                <View style={styles.buttonDelete}>
                  <ButtonPaper
                    onPress={() => {
                      setOpenDelete(false);
                    }}
                    disabled={isLoadingDelete}
                  >
                    Hủy
                  </ButtonPaper>
                </View>
                <View style={styles.buttonDelete}>
                  <ButtonPaper
                    onPress={onDeletePassCodeAccept}
                    loading={isLoadingDelete}
                    disabled={isLoadingDelete}
                  >
                    Xác nhận
                  </ButtonPaper>
                </View>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      {open && (
        <Portal>
          <Dialog
            style={styles.dialog}
            visible={true}
            onDismiss={() => {
              setOpen(false);
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
                  <Button mode="contained" onPress={createPassCodePress} loading={isLoading}>
                    Xác nhận
                  </Button>
                </View>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      <List.Item
        title="Đặt mã bảo mật"
        onPress={onCreatePassCodePress}
        left={() => (
          <View
            style={{
              backgroundColor: '#69dd46',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#69dd46',
              transform: [{ scale: 0.8 }],
            }}
          >
            <List.Icon icon="key-plus" color="white" />
          </View>
        )}
        titleStyle={{ fontSize: 18 }}
      />
      <Divider />
      {isDisable ? (
        <List.Item
          disabled={isDisable}
          title="Xóa mã bảo mật"
          onPress={onDeletePassCodePress}
          left={() => (
            <View
              style={{
                backgroundColor: '#f33e3e',
                borderRadius: 15,
                borderWidth: 1,
                borderColor: '#f33e3e',
                transform: [{ scale: 0.8 }],
              }}
            >
              <List.Icon icon="key-remove" color="white" />
            </View>
          )}
          titleStyle={{ fontSize: 18 }}
          style={{
            opacity: 0.5,
          }}
        />
      ) : (
        <List.Item
          title="Xóa mã bảo mật"
          onPress={onDeletePassCodePress}
          left={() => (
            <View
              style={{
                backgroundColor: '#f33e3e',
                borderRadius: 15,
                borderWidth: 1,
                borderColor: '#f33e3e',
                transform: [{ scale: 0.8 }],
              }}
            >
              <List.Icon icon="key-remove" color="white" />
            </View>
          )}
          titleStyle={{ fontSize: 18 }}
        />
      )}
      <Divider />
    </View>
  );
}
