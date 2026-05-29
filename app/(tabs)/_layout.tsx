import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';
import { COLORS } from '../../src/theme/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.surfaceBorder,
          elevation: 8,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
