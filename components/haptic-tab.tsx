// SDK 56: @react-navigation/bottom-tabs and @react-navigation/elements are no longer
// direct dependencies. Using React Native's Pressable as a compatible replacement.
import * as Haptics from 'expo-haptics';
import { Pressable, type GestureResponderEvent, type PressableProps } from 'react-native';

// TProps compatible with expo-router's tab bar button interface
type THapticTabProps = PressableProps & {
  children?: React.ReactNode;
};

export function HapticTab({ onPressIn, ...props }: THapticTabProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev: GestureResponderEvent) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
    />
  );
}
