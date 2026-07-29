import { useTheme } from "@/src/hooks/useTheme";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IScreenWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  scrollable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  useSafeArea?: boolean;
  padding?: number;
}

export default function ScreenWrapper({
  children,
  header,
  scrollable = true,
  onRefresh,
  refreshing = false,
  useSafeArea = true,
  padding,
}: IScreenWrapperProps) {
  const { colors, isDark } = useTheme();
  const primaryColor = colors.primary;
  const bgColor = colors.background;

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
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bgColor}
        translucent={Platform.OS === "android"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <WrapperComponent className="flex-1">
          {header}
          {renderContent()}
        </WrapperComponent>
      </KeyboardAvoidingView>
    </View>
  );
}
