import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Book, Heart, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72 + (insets.bottom > 0 ? insets.bottom - 5 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom + 5 : 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabSongs'),
          tabBarIcon: ({ color, size }) => (
            <Book color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabFavorites'),
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabSettings'),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
