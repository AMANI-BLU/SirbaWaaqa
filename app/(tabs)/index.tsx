import { HymnCard } from '@/components/HymnCard';
import { ThemedText } from '@/components/ThemedText';
import { CUSTOM_HYMN_ORDER } from '@/constants/hymnOrder';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { hymns } from '@/mocks/hymns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowDownUp, Book, Search } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useLanguage();

  const [sortOrder, setSortOrder] = useState<'custom' | 'numerical'>('custom');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedHymns = useMemo(() => {
    const base = [...hymns];
    if (sortOrder === 'numerical') {
      return base.sort((a, b) => a.number - b.number);
    }
    return base.sort((a, b) => {
      const idxA = CUSTOM_HYMN_ORDER.indexOf(a.number);
      const idxB = CUSTOM_HYMN_ORDER.indexOf(b.number);

      // If both are not in custom order, sort numerically
      if (idxA === -1 && idxB === -1) return a.number - b.number;
      // If only A is missing, it goes to the end
      if (idxA === -1) return 1;
      // If only B is missing, it goes to the end
      if (idxB === -1) return -1;

      return idxA - idxB;
    });
  }, [sortOrder]);

  const filteredHymns = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedHymns;
    }
    return sortedHymns.filter((hymn) => {
      const query = searchQuery.toLowerCase();
      return (
        hymn.number.toString().includes(query) ||
        hymn.title.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, sortedHymns]);

  const handleHymnPress = useCallback((id: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/hymn/${id}`);
  }, [router]);

  const renderHymn = useCallback(({ item, index }: { item: typeof hymns[0]; index: number }) => (
    <HymnCard item={item} index={index} onPress={handleHymnPress} />
  ), [handleHymnPress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: Math.max(insets.top, 24) + 16, backgroundColor: colors.accent }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.titleContent}>
                <Book
                  color={theme === 'light' ? colors.gold : colors.cream}
                  size={32}
                  strokeWidth={2.5}
                />
                <View style={styles.titleTextContainer}>
                  <ThemedText
                    style={[styles.headerTitle, { color: theme === 'light' ? colors.gold : colors.cream }]}
                  >
                    {t('appTitle')}
                  </ThemedText>
                  <ThemedText style={[styles.headerSubtitle, { color: colors.cream }]}>{t('appSubtitle')}</ThemedText>
                </View>
              </View>

            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Search color={colors.accent} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.statsContainer}>
          <ThemedText style={[styles.statsText, { color: colors.accent, opacity: 0.8 }]}>
            {filteredHymns.length}{' '}
            {filteredHymns.length === 1 ? t('songCount') : t('songsCount')}
          </ThemedText>

          <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              setSortOrder(sortOrder === 'custom' ? 'numerical' : 'custom');
            }}
            activeOpacity={0.7}
          >
            <ArrowDownUp color={colors.accent} size={14} strokeWidth={2} />
            <ThemedText style={[styles.sortButtonText, { color: colors.accent }]}>
              {sortOrder === 'custom' ? t('sortNumerical') : t('sortCustom')}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredHymns}
          renderItem={renderHymn}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 24,
  },
  headerPadding: {
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  titleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: '500' as const,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
