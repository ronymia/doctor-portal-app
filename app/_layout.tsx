import '../global.css';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Stack, router } from 'expo-router';
import { useColorScheme } from 'react-native';
import appStorage from '../src/services/storage';
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';

import { store } from '../src/store/store';
import { setupInterceptors } from '../src/api/interceptors';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { setCredentials, logout, selectIsAuthenticated, selectIsRestoring } from '../src/store/slices/authSlice';
import AppLoader from '../src/components/common/AppLoader';

// Wire Axios interceptors once — before any API call is made.
// Passing the store reference lets interceptors read auth state
// and dispatch logout / setCredentials without circular imports.
setupInterceptors(store);

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isRestoring = useAppSelector(selectIsRestoring);

  // Restore Session on Startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await appStorage.getItem('auth_token');
        const userJson = await appStorage.getItem('auth_user');
        
        if (token && userJson) {
          dispatch(
            setCredentials({
              token,
              user: JSON.parse(userJson),
            })
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
      router.replace('/(tabs)');
    } else {
      // Direct login mount
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isRestoring]);

  if (isRestoring) {
    return <AppLoader message="Restoring clinical workspace..." overlay />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="doctor/[id]" />
        <Stack.Screen name="book/[serviceId]" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
