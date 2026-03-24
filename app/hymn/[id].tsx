import { HymnImageCreator } from '@/components/HymnImageCreator';
import { ThemedText } from '@/components/ThemedText';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { hymns } from '@/mocks/hymns';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ALargeSmall,
  Book,
  ChevronLeft,
  Heart,
  ImageIcon,
  Minus,
  Plus,
  Share2,
  X
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HymnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const hymn = hymns.find((h) => h.id === Number(id));
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { fontSizeScale, updateFontSizeScale } = useSettings();

  const [imageCreatorVisible, setImageCreatorVisible] = useState(false);
  const [displaySettingsVisible, setDisplaySettingsVisible] = useState(false);
  const [capturedText, setCapturedText] = useState("");

  const stanzas = useMemo(() => {
    if (!hymn) return [];
    const result: string[][] = [];
    let current: string[] = [];
    hymn.lyrics.forEach(line => {
      if (line === "") {
        if (current.length > 0) result.push(current);
        current = [];
      } else {
        current.push(line);
      }
    });
    if (current.length > 0) result.push(current);
    return result;
  }, [hymn]);

  const [selectedStanzaIndices, setSelectedStanzaIndices] = useState<number[]>([]);

  // Bubble Animation State
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bubbleSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (selectedStanzaIndices.length > 0) {
      Animated.parallel([
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(bubbleSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleSlide, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [selectedStanzaIndices.length]);

  const handleStanzaPress = useCallback((index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setSelectedStanzaIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }, []);

  // Update captured text whenever selection changes
  useEffect(() => {
    const selectedText = selectedStanzaIndices
      .sort((a, b) => a - b)
      .map(idx => stanzas[idx].join('\n'))
      .join('\n\n');
    setCapturedText(selectedText);
  }, [selectedStanzaIndices, stanzas]);

  const handleImagePress = useCallback(() => {
    if (!capturedText && selectedStanzaIndices.length === 0) {
      Alert.alert(
        t('appearance'),
        t('selectLyricsHint'),
        [{ text: 'OK' }]
      );
      return;
    }
    setImageCreatorVisible(true);
  }, [capturedText, selectedStanzaIndices, t]);

  const handleToggleFavorite = useCallback(() => {
    if (hymn) {
      toggleFavorite(hymn.id);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [hymn, toggleFavorite]);


  const handleShareText = useCallback(async () => {
    if (!hymn) return;
    const textToShare = capturedText || hymn.lyrics.join('\n');
    const fullText = `#${hymn.number} - ${hymn.title}\n\n${textToShare}\n\n— Waaqa Faarsina App`;
    try {
      const { Share } = require('react-native');
      await Share.share({ message: fullText, title: hymn.title });
    } catch (e) {
      console.error('Share failed:', e);
    }
  }, [hymn, capturedText]);

  const handleShareAction = useCallback(() => {
    Alert.alert(
      t('share'),
      "",
      [
        {
          text: t('shareText'),
          onPress: handleShareText,
        },
        {
          text: t('createImage'),
          onPress: handleImagePress,
        },
        {
          text: t('cancel'),
          style: 'cancel',
        },
      ]
    );
  }, [handleShareText, handleImagePress, t]);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.errorText, { color: colors.text }]}>Hymn not found</ThemedText>
      </View>
    );
  }

  const isFav = isFavorite(hymn.id);
  const iconColor = theme === 'light' ? colors.gold : colors.cream;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.customHeaderContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: Math.max(insets.top, 24) + 12, backgroundColor: colors.accent }]}>
          <View style={styles.customHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft color={iconColor} size={28} strokeWidth={2.5} />
            </TouchableOpacity>

            <ThemedText style={[styles.customHeaderTitle, { color: iconColor }]}>
              #{hymn.number}
            </ThemedText>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setDisplaySettingsVisible(true)} style={styles.actionIcon}>
                <ALargeSmall color={iconColor} size={28} strokeWidth={2.2} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionIcon}>
                <Heart color={iconColor} size={23} strokeWidth={2.2} fill={isFav ? iconColor : 'transparent'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Card header */}
          <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.numberBadge}>
              <Book color={colors.accent} size={24} strokeWidth={2.5} />
              <ThemedText style={[styles.numberText, { color: colors.accent }]}>#{hymn.number}</ThemedText>
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>{hymn.title}</ThemedText>
            {hymn.category && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.cream, borderColor: colors.accent }]}>
                <ThemedText style={[styles.categoryText, { color: colors.accent }]}>{hymn.category}</ThemedText>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.gold }]} />

          {/* Stanza-based lyrics with selection highlighting */}
          <View style={[styles.lyricsContainer, { backgroundColor: colors.cardBackground }]}>
            {stanzas.map((stanza: string[], index: number) => {
              const isSelected = selectedStanzaIndices.includes(index);
              const highlightBg = theme === 'dark' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(212, 175, 55, 0.35)';
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => handleStanzaPress(index)}
                  style={[
                    styles.stanzaContainer,
                    {
                      backgroundColor: isSelected ? highlightBg : 'transparent',
                      borderLeftColor: isSelected ? colors.gold : 'transparent',
                      borderLeftWidth: 4,
                      paddingLeft: 16,
                      paddingRight: 16,
                      marginLeft: -15,
                      marginRight: -15,
                    }
                  ]}
                >
                  {stanza.map((line: string, lineIdx: number) => (
                    <View key={lineIdx}>
                      <ThemedText
                        style={[
                          styles.lyricLine,
                          {
                            // In Dark Mode, ensure text is bright enough over the highlight
                            color: isSelected && theme === 'dark' ? '#FFFFFF' : colors.text,
                            fontSize: 18 * fontSizeScale,
                            fontFamily: 'Outfit_400Regular',
                            lineHeight: 18 * fontSizeScale * 1.6,
                            borderBottomWidth: isSelected ? 1 : 0,
                            borderBottomColor: colors.accent + '40',
                            borderStyle: 'dashed',
                          },
                        ]}
                      >
                        {line}
                      </ThemedText>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Contextual Action Bubble (Premium Animated Pill) */}
      {selectedStanzaIndices.length > 0 && (
        <Animated.View
          style={[
            styles.bubbleContainer,
            {
              bottom: Math.max(insets.bottom, 20) + 20,
              opacity: bubbleAnim,
              transform: [{ translateY: bubbleSlide }]
            }
          ]}
        >
          <View style={[styles.bubblePill, { backgroundColor: 'rgba(28, 20, 16, 0.98)', borderColor: colors.gold + '40' }]}>
            <TouchableOpacity style={styles.bubbleAction} onPress={handleShareText}>
              <Share2 color="#FFFFFF" size={18} strokeWidth={2.5} />
              <ThemedText style={styles.bubbleBtnText}>{t('shareText')}</ThemedText>
            </TouchableOpacity>

            <View style={styles.bubbleDivider} />

            <TouchableOpacity style={styles.bubbleAction} onPress={handleImagePress}>
              <ImageIcon color="#FFFFFF" size={18} strokeWidth={2.5} />
              <ThemedText style={styles.bubbleBtnText}>{t('createImage')}</ThemedText>
            </TouchableOpacity>

            <View style={styles.bubbleDivider} />

            <TouchableOpacity
              style={styles.bubbleClose}
              onPress={() => setSelectedStanzaIndices([])}
            >
              <X color="#FFFFFF" size={20} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Reader Options Modal (Aesthetics & Dark Mode Fix) */}
      <Modal
        visible={displaySettingsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDisplaySettingsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDisplaySettingsVisible(false)}
        >
          <View style={[styles.displaySettingsCard, { backgroundColor: colors.cardBackground, borderTopColor: colors.gold }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.secondaryText + '30' }]} />

            <View style={styles.modalHeader}>
              <ThemedText style={[styles.modalTitle, { color: colors.text }]}>{t('appearance')}</ThemedText>
              <TouchableOpacity onPress={() => setDisplaySettingsVisible(false)}>
                <X color={colors.secondaryText} size={24} />
              </TouchableOpacity>
            </View>

            {/* Font Size Settings */}
            <View style={styles.settingItem}>
              <ThemedText style={[styles.settingLabel, { color: colors.accent }]}>{t('fontSize')}</ThemedText>
              <View style={[styles.fontSizeControls, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                <TouchableOpacity
                  onPress={() => updateFontSizeScale(fontSizeScale - 0.1)}
                  style={[styles.fontSizeBtn, { backgroundColor: colors.accent + '15' }]}
                >
                  <Minus color={colors.accent} size={22} strokeWidth={3} />
                </TouchableOpacity>
                <ThemedText style={[styles.fontSizeValue, { color: colors.text }]}>{Math.round(fontSizeScale * 100)}%</ThemedText>
                <TouchableOpacity
                  onPress={() => updateFontSizeScale(fontSizeScale + 0.1)}
                  style={[styles.fontSizeBtn, { backgroundColor: colors.accent + '15' }]}
                >
                  <Plus color={colors.accent} size={22} strokeWidth={3} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Image Creator Modal */}
      <HymnImageCreator
        visible={imageCreatorVisible}
        onClose={() => setImageCreatorVisible(false)}
        hymn={hymn}
        initialLyrics={capturedText}
        colors={colors}
        theme={theme as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeaderContainer: {
    paddingBottom: 12,
  },
  headerPadding: {
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  customHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    paddingLeft: 4,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  actionIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  contentContainer: { flex: 1 },
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
  numberText: { fontSize: 18, fontWeight: '700' as const },
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, marginBottom: 12 },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '600' as const },
  divider: { height: 3, marginHorizontal: 20, marginBottom: 24 },
  lyricsContainer: { paddingHorizontal: 20, paddingVertical: 10 },
  stanzaContainer: {
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderStyle: 'solid',
  },
  lyricLine: {
    fontSize: 18,
    lineHeight: 32,
    fontWeight: '400' as const,
    textAlign: 'left',
  },
  lyricLineEmpty: { marginBottom: 12 },
  errorText: { fontSize: 18, textAlign: 'center', marginTop: 40 },



  modalDivider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.3,
  },
  bubbleContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  bubblePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 60,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bubbleAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: '100%',
  },
  bubbleBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Outfit_700Bold',
  },
  bubbleDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  bubbleClose: {
    paddingLeft: 14,
    paddingRight: 6,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  displaySettingsCard: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderTopWidth: 1,
    padding: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  settingItem: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 8,
  },
  fontSizeBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
