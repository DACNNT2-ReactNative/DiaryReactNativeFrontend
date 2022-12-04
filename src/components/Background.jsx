import React from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { theme } from '../core/theme';

export default function Background({ children }) {
  return (
    // <ImageBackground source={require("../assets/background_dot.png")} resizeMode="stretch" style={styles.background}>
    <ImageBackground resizeMode="stretch" style={styles.background}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
