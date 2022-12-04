import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../core/theme';

export default function Button({ mode, style, labelStyle, ...props }) {
  return (
    <PaperButton
      loading={props.loading}
      disabled={props.loading}
      icon={props.icon}
      style={[style ? style : styles.button, mode === 'outlined' && { backgroundColor: theme.colors.surface }, style]}
      labelStyle={labelStyle ? labelStyle : styles.text}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius: 15,
  },
  text: {
    fontSize: 12,
    lineHeight: 26,
    color: '#FFFFFF',
  },
});
