import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useState, useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExpensesProvider } from '@/context/ExpensesContext';
import { AuthProvider } from '@/context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '@/components/LoadingScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const theme = colorScheme === 'dark' ? DarkTheme : DarkTheme;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={theme}>
      <SafeAreaProvider>
        <AuthProvider>
          <ExpensesProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#0D1117' }}>
              <Stack screenOptions={{
                headerStyle: { backgroundColor: '#0D1117' },
                headerTintColor: '#fff',
                contentStyle: { backgroundColor: '#0D1117' },
                headerShown: false,
              }}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="setup" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="group-details" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
            </SafeAreaView>
          </ExpensesProvider>
        </AuthProvider>
      </SafeAreaProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

