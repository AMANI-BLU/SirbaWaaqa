import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Book } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { hymns } from '@/mocks/hymns';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function FavoritesScreen() {
  
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const handleHymnPress = (id: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/hymn/${id}`);
  };

  const favoriteHymns = hymns.filter((hymn) => favorites.includes(hymn.id));

  const HymnCard = ({ item, index }: { item: typeof hymns[0]; index: number }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          opacity: fadeValue,
        }}
      >
        <TouchableOpacity
          style={[
            styles.hymnCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
          onPress={() => handleHymnPress(item.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.cardContent}>
            <View style={[styles.hymnNumber, { backgroundColor: colors.accent }]}>
              <Text style={[styles.hymnNumberText, { color: colors.cardBackground }]}>
                {item.number}
              </Text>
            </View>
            <View style={styles.hymnContent}>
              <Text style={[styles.hymnTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              {item.englishTranslation && (
                <View style={styles.translationContainer}>
                  <Text style={[styles.translationLabel, { color: colors.accent, opacity: 0.6 }]}>•</Text>
                  <Text style={[styles.hymnTranslation, { color: colors.accent }]} numberOfLines={1}>
                    {item.englishTranslation}
                  </Text>
                </View>
              )}
            </View>
            <Heart color={colors.deepRed} size={22} strokeWidth={2} fill={colors.deepRed} />
          </View>
          <View style={[styles.cardDecoration, { backgroundColor: colors.gold }]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHymn = ({ item, index }: { item: typeof hymns[0]; index: number }) => (
    <HymnCard item={item} index={index} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={[styles.headerContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: insets.top + 16, backgroundColor: colors.accent }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Heart
                color={theme === 'light' ? colors.gold : colors.cream}
                size={32}
                strokeWidth={2}
                />
              <View style={styles.titleTextContainer}>
                    <Text
                      style={[
                          styles.headerTitle,
                          { color: theme === 'light' ? colors.gold : colors.cream }
                      ]}
                      >
                      {t('favorites')}
                    </Text>                
                    <Text style={[styles.headerSubtitle, { color: colors.cream }]}>{t('savedSongs')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {favoriteHymns.length === 0 ? (
          <View style={styles.emptyState}>
            <Book color={colors.border} size={64} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noFavorites')}</Text>
            <Text style={[styles.emptyDescription, { color: colors.secondaryText }]}>
              {t('noFavoritesDesc')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Text style={[styles.statsText, { color: colors.accent, opacity: 0.8 }]}>
                {favoriteHymns.length}{' '}
                {favoriteHymns.length === 1 ? t('favoriteCountSingle') : t('favoriteCount')}
              </Text>
            </View>

            <FlatList
              data={favoriteHymns}
              renderItem={renderHymn}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
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
