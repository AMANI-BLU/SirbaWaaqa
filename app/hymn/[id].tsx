import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { hymns } from '@/mocks/hymns';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Book, Heart } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colors } = useTheme();
  const hymn = hymns.find((h) => h.id === Number(id));
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = useCallback(() => {
    if (hymn) {
      toggleFavorite(hymn.id);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [hymn, toggleFavorite]);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Hymn not found</Text>
      </View>
    );
  }

  const isFav = hymn ? isFavorite(hymn.id) : false;
  const iconColor = theme === 'light' ? colors.gold : colors.cream; // favorite and back icon color

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `#${hymn.number}`,
          headerStyle: { backgroundColor: colors.accent },
          headerTintColor: iconColor, // back button color
          headerRight: () => (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}
              activeOpacity={0.7}
            >
              <Heart
                color={iconColor}
                size={24}
                strokeWidth={2}
                fill={isFav ? iconColor : 'transparent'}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.header,
              { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.numberBadge}>
              <Book color={colors.accent} size={24} strokeWidth={2.5} />
              <Text style={[styles.numberText, { color: colors.accent }]}>#{hymn.number}</Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{hymn.title}</Text>

            {hymn.category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.cream, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.categoryText, { color: colors.accent }]}>{hymn.category}</Text>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.gold }]} />

          <View style={[styles.lyricsContainer, { backgroundColor: colors.cardBackground }]}>
            {hymn.lyrics.map((line, index) => (
              <Text
                key={index}
                style={[
                  styles.lyricLine,
                  { color: colors.text },
                  line === '' && styles.lyricLineEmpty,
                ]}
              >
                {line || ' '}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favoriteButton: {
    marginRight: 8,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  numberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  divider: {
    height: 3,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  lyricsContainer: {
    paddingHorizontal: 20,
    paddingVertical:20
  },
  lyricLine: {
    fontSize: 18,
    lineHeight: 32,
    fontWeight: '400' as const,
    textAlign: 'left',
  },
  lyricLineEmpty: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
