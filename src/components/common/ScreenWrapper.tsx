import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  RefreshControl,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  useSafeArea?: boolean;
  padding?: number;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  onRefresh,
  refreshing = false,
  useSafeArea = true,
  padding,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const bgColor = isDark ? '#0B0F19' : '#F8FAFC';

  const contentPadding = padding !== undefined ? { padding } : { padding: 0 };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, ...contentPadding }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={primaryColor}
                colors={[primaryColor]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View className="flex-1" style={contentPadding}>
        {children}
      </View>
    );
  };

  const WrapperComponent = useSafeArea ? SafeAreaView : View;

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
        translucent={Platform.OS === 'android'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <WrapperComponent className="flex-1">
          {renderContent()}
        </WrapperComponent>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ScreenWrapper;
