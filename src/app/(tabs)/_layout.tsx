import { COLORS } from "@/src/theme/theme";
import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? COLORS.dark : COLORS.light;

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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: "Doctors",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admins"
        options={{
          title: "Admins",
          tabBarIcon: ({ color }) => (
            <Feather name="shield" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeslots"
        options={{
          title: "Time Slots",
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
