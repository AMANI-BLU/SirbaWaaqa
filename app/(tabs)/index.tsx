import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Book } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { hymns } from '@/mocks/hymns';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHymns = useMemo(() => {
    if (!searchQuery.trim()) {
      return hymns;
    }
    return hymns.filter((hymn) => {
      const query = searchQuery.toLowerCase();
      return (
        hymn.number.toString().includes(query) ||
        hymn.title.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handleHymnPress = (id: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/hymn/${id}`);
  };

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
              <Book
                color={theme === 'light' ? colors.gold : colors.cream}
                size={32}
                strokeWidth={2.5}
                />
              <View style={styles.titleTextContainer}>
                    <Text
                    style={[styles.headerTitle, { color: theme === 'light' ? colors.gold : colors.cream }]}
                    >
                    {t('appTitle')}
                    </Text>                
                    <Text style={[styles.headerSubtitle, { color: colors.cream }]}>{t('appSubtitle')}</Text>
              </View>
            </View>
            <Text style={[styles.headerDescription, { color: colors.cream, opacity: 0.9 }]}>
              {t('appDescription')}
            </Text>
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
          <Text style={[styles.statsText, { color: colors.accent, opacity: 0.8 }]}>
            {filteredHymns.length}{' '}
            {filteredHymns.length === 1 ? t('songCount') : t('songsCount')}
          </Text>
        </View>

        <FlatList
          data={filteredHymns}
          renderItem={renderHymn}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  headerDescription: {
    fontSize: 14,
    opacity: 0.9,
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
});
