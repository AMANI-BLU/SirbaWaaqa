import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info, Book, Mail, Moon, Sun, Smartphone, Globe, AlertCircle, User, Phone, AtSign } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, colors, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={[styles.headerContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: insets.top + 16, backgroundColor: colors.accent }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
            <Info
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
                    {t('about')}
                    </Text>

                <Text style={[styles.headerSubtitle, { color: colors.cream }]}>{t('appTitle')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={[styles.appIconContainer, { backgroundColor: colors.cream, borderColor: colors.gold }]}>
            <Book color={colors.gold} size={64} strokeWidth={2} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>{t('appTitle')}</Text>
          <Text style={[styles.appNameEnglish, { color: colors.richGreen }]}>{t('appSubtitle')}</Text>
          <Text style={[styles.versionText, { color: colors.secondaryText }]}>{t('version')} 1.0.0</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                themeMode === 'light' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => setTheme('light')}
              activeOpacity={0.7}
            >
              <Sun color={themeMode === 'light' ? colors.gold : colors.text} size={22} strokeWidth={2} />
              <Text style={[styles.optionText, { color: themeMode === 'light' ? colors.gold : colors.text }]}>
                {t('themeLight')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                themeMode === 'dark' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => setTheme('dark')}
              activeOpacity={0.7}
            >
              <Moon color={themeMode === 'dark' ? colors.gold : colors.text} size={22} strokeWidth={2} />
              <Text style={[styles.optionText, { color: themeMode === 'dark' ? colors.gold : colors.text }]}>
                {t('themeDark')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                themeMode === 'system' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => setTheme('system')}
              activeOpacity={0.7}
            >
              <Smartphone color={themeMode === 'system' ? colors.gold : colors.text} size={22} strokeWidth={2} />
              <Text style={[styles.optionText, { color: themeMode === 'system' ? colors.gold : colors.text }]}>
                {t('themeSystem')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                language === 'en' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.7}
            >
              <Globe color={language === 'en' ? colors.gold : colors.text} size={22} strokeWidth={2} />
              <Text style={[styles.optionText, { color: language === 'en' ? colors.gold : colors.text }]}>
                {t('languageEnglish')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                language === 'om' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => setLanguage('om')}
              activeOpacity={0.7}
            >
              <Globe color={language === 'om' ? colors.gold : colors.text} size={22} strokeWidth={2} />
              <Text style={[styles.optionText, { color: language === 'om' ? colors.gold : colors.text }]}>
                {t('languageOromo')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('aboutApp')}</Text>
          <Text style={[styles.descriptionText, { color: colors.secondaryText }]}>
            {t('aboutDesc')}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('developer')}</Text>
          <View style={[styles.developerCard, { backgroundColor: colors.cardBackground, borderColor: colors.gold }]}>
            <View style={[styles.developerIconContainer, { backgroundColor: colors.accent }]}>
              <User color={colors.gold} size={32} strokeWidth={2} />
            </View>
            <Text style={[styles.developerName, { color: colors.text }]}>Amanuel Solomon</Text>
            <Text style={[styles.developerRole, { color: colors.accent }]}>{t('madeWithLove')}</Text>
            
            <View style={styles.contactInfoContainer}>
              <TouchableOpacity
                style={[styles.contactInfoButton, { backgroundColor: colors.cream }]}
                onPress={() => handleLink('mailto:solomonamanuel66@gmail.com')}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
                  <AtSign color={colors.gold} size={18} strokeWidth={2} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={[styles.contactLabel, { color: colors.accent, opacity: 0.7 }]}>Email</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]} numberOfLines={1}>solomonamanuel66@gmail.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactInfoButton, { backgroundColor: colors.cream }]}
                onPress={() => handleLink('tel:+251919231519')}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
                  <Phone color={colors.gold} size={18} strokeWidth={2} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={[styles.contactLabel, { color: colors.accent, opacity: 0.7 }]}>Phone</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]}>+251 919 231 519</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('reportErrors')}</Text>
          <View style={[styles.reportCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <AlertCircle color={colors.deepRed} size={24} strokeWidth={2} />
            <View style={styles.reportContent}>
              <Text style={[styles.reportTitle, { color: colors.text }]}>{t('foundError')}</Text>
              <Text style={[styles.reportDescription, { color: colors.secondaryText }]}>
                {t('foundErrorDesc')}
              </Text>
            </View>
          </View>
          <View style={styles.contactSection}>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.deepRed }]}
              onPress={() => handleLink('mailto:solomonamanuel66@gmail.com')}
              activeOpacity={0.7}
            >
              <Mail color="#FFFFFF" size={20} strokeWidth={2} />
              <Text style={styles.contactButtonText}>{t('sendReport')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            {t('footer')}
          </Text>
          <Text style={[styles.blessingText, { color: colors.richGreen }]}>
            {t('blessing')}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 4,
  },
  appNameEnglish: {
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    minWidth: 100,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  reportCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  developerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  developerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  developerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 6,
  },
  developerRole: {
    fontSize: 15,
    fontWeight: '500' as const,
    textAlign: 'center',
    marginBottom: 24,
  },
  contactInfoContainer: {
    width: '100%',
    gap: 12,
  },
  contactInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  contactSection: {
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  footerText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  blessingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomSpacer: {
    height: 40,
  },
});
