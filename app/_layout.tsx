import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <AlertNotificationRoot>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="detailRangkuman" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" hidden />
        </ThemeProvider>
      </AlertNotificationRoot>
    </AuthProvider>
  );
}
