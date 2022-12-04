import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../core/theme';

export default function TextInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        mode="outlined"
        theme={{
          roundness: 15,
          colors: {
            primary: '#758AD4',
          },
        }}
        underlineColor={'transparent'}
        underlineColorAndroid="transparent"
        {...props}
      />
      {description && !errorText ? <Text style={styles.description}>{description}</Text> : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#F3F6FF',
    borderColor: '#F3F6FF',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
