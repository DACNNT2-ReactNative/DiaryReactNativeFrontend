import * as React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../core/theme';

const Loading = () => <ActivityIndicator animating={true} color={theme.colors.loading} />;

export default Loading;
