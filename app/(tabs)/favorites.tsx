import { HymnCard } from '@/components/HymnCard';
import { ThemedText } from '@/components/ThemedText';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { hymns } from '@/mocks/hymns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Book, Heart } from 'lucide-react-native';
import { useCallback } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const handleHymnPress = useCallback((id: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/hymn/${id}`);
  }, [router]);

  const favoriteHymns = hymns.filter((hymn) => favorites.includes(hymn.id));

  const renderHymn = useCallback(({ item, index }: { item: typeof hymns[0]; index: number }) => (
    <HymnCard item={item} index={index} onPress={handleHymnPress} isFavorite={true} />
  ), [handleHymnPress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: Math.max(insets.top, 24) + 16, backgroundColor: colors.accent }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Heart
                color={theme === 'light' ? colors.gold : colors.cream}
                size={24}
                strokeWidth={2}
              />
              <View style={styles.titleTextContainer}>
                <ThemedText
                  style={[
                    styles.headerTitle,
                    { color: theme === 'light' ? colors.gold : colors.cream }
                  ]}
                >
                  {t('favorites')}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {favoriteHymns.length === 0 ? (
          <View style={styles.emptyState}>
            <Book color={colors.border} size={64} strokeWidth={1.5} />
            <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>{t('noFavorites')}</ThemedText>
            <ThemedText style={[styles.emptyDescription, { color: colors.secondaryText }]}>
              {t('noFavoritesDesc')}
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <ThemedText style={[styles.statsText, { color: colors.accent, opacity: 0.8 }]}>
                {favoriteHymns.length}{' '}
                {favoriteHymns.length === 1 ? t('favoriteCountSingle') : t('favoriteCount')}
              </ThemedText>
            </View>

            <FlatList
              data={favoriteHymns}
              renderItem={renderHymn}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={Platform.OS === 'android'}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 16,
  },
  headerPadding: {
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hymnCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  cardDecoration: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    opacity: 0.1,
    transform: [{ rotate: '45deg' }, { translateX: 40 }, { translateY: -40 }],
  },
  hymnNumber: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hymnNumberText: {
    fontSize: 22,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  hymnContent: {
    flex: 1,
    justifyContent: 'center',
  },
  hymnTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    marginBottom: 6,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  translationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  translationLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  hymnTranslation: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontStyle: 'italic' as const,
    opacity: 0.85,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
