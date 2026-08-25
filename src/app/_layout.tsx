import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  router,
} from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, useColorScheme } from "react-native";
import { Provider } from "react-redux";
import "../../global.css";
import appStorage from "@/src/services/storage";

import AppModalProvider from "@/src/providers/AppModalProvider";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setupInterceptors } from "@/src/api/interceptors";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  logout,
  selectIsAuthenticated,
  selectIsRestoring,
  setCredentials,
} from "@/src/store/slices/authSlice";
import { store } from "@/src/store/store";

// Wire Axios interceptors once — before any API call is made.
// Passing the store reference lets interceptors read auth state
// and dispatch logout / setCredentials without circular imports.
setupInterceptors(store);

// Keep the native splash screen visible while restoring session/resources
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const [animationFinished, setAnimationFinished] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isRestoring = useAppSelector(selectIsRestoring);

  // Restore Session on Startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await appStorage.getItem("auth_token");
        const userJson = await appStorage.getItem("auth_user");

        if (token && userJson) {
          dispatch(
            setCredentials({
              token,
              user: JSON.parse(userJson),
            }),
          );
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      }
    };
    restoreSession();
  }, [dispatch]);

  // Handle Route Protection & Redirects
  useEffect(() => {
    if (isRestoring) return;

    if (isAuthenticated) {
      // Direct main dashboard layout mount
      router.replace("/(tabs)");
    } else {
      // Direct login mount
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isRestoring]);

  // Hide native splash screen and kick off fade-out animation when restoration completes
  useEffect(() => {
    if (!isRestoring) {
      // Hide native splash screen immediately, our custom view is overlaying it
      SplashScreen.hideAsync().catch(() => {});

      // Animate fade-out and scaling
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 350,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setAnimationFinished(true);
      });
    }
  }, [isRestoring]);

  if (isRestoring) {
    return null; // Keep rendering null so the native splash screen stays visible
  }

  const splashBg = "#ffffff";

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="doctor/[id]" />
        <Stack.Screen name="book/[serviceId]" />
      </Stack>

      {!animationFinished && (
        <Animated.View
          
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: splashBg,
              opacity: fadeAnim,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999,
              pointerEvents: "none",
            },
          ]}
        >
          <Animated.Image
            source={require("../assets/images/splash-icon.png")}
            resizeMode="contain"
            style={{
              width: 200,
              height: 200,
              transform: [{ scale: scaleAnim }],
            }}
          />
        </Animated.View>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppModalProvider>
          <RootLayoutNav />
        </AppModalProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
