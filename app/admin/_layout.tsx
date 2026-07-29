import { Stack } from "expo-router";

// ADMIN STACK LAYOUT — ALL ADMIN SCREENS SHARE THIS STACK
// Header is hidden globally; each screen owns its own header row.
export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    />
  );
}
