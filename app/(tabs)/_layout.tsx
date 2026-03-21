import { Tabs } from 'expo-router';
import { Book, Heart, Info } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
        name="about"
        options={{
          title: t('tabAbout'),
          tabBarIcon: ({ color, size }) => (
            <Info color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
