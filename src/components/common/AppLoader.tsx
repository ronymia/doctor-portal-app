import React from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import AppText from './AppText';

interface AppLoaderProps {
  message?: string;
  overlay?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ message, overlay = false }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = isDark ? '#14B8A6' : '#0F766E';

  if (overlay) {
    return (
      <View className="absolute inset-0 justify-center items-center z-[9999] bg-black/40">
        <View className="p-6 rounded-2xl bg-white dark:bg-dark-surface items-center min-w-[120px] shadow-lg">
          <ActivityIndicator size="large" color={primaryColor} />
          {message && (
            <AppText className="mt-3 text-center" weight="medium" variant="bodySecondary">
              {message}
            </AppText>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <ActivityIndicator size="large" color={primaryColor} />
      {message && (
        <AppText className="mt-3 text-center" weight="medium" variant="bodySecondary">
          {message}
        </AppText>
      )}
    </View>
  );
};

export default AppLoader;
