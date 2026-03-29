// template
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SettingsProvider } from '@/contexts/SettingsContext';
import {
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts
} from '@expo-google-fonts/outfit';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav({ loaded }: { loaded: boolean }) {
  const { colors, theme } = useTheme();
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  const onSplashReady = () => {
    SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        // Force dark background for system bars (phone menus) in both cases
        // This makes the translucent navigation bar area look dark
        SystemUI.setBackgroundColorAsync('#000000');

        // Ensure light icons (white) are used for high contrast on the dark system area
        NavigationBar.setButtonStyleAsync('light');
      } catch (e) { }
    }
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        style="light"
        backgroundColor="transparent"
        translucent={true}
      />

      <Stack screenOptions={{
        headerBackTitle: "Back",
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background }
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="hymn/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {!isAnimationFinished && (
        <AnimatedSplashScreen
          onReady={onSplashReady}
          onAnimationComplete={() => setIsAnimationFinished(true)}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Inter_400Regular,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Note: SplashScreen.hideAsync() is now handled by the custom AnimatedSplashScreen onReady callback

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <ThemeProvider>
              <LanguageProvider>
                <FavoritesProvider>
                  <RootLayoutNav loaded={loaded} />
                </FavoritesProvider>
              </LanguageProvider>
            </ThemeProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
