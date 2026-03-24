import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  ChevronRight,
  Globe,
  Info,
  Mail,
  Moon,
  Settings,
  Smartphone,
  Sun,
  User
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, colors, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [aboutVisible, setAboutVisible] = useState(false);
  const [developerVisible, setDeveloperVisible] = useState(false);

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const SettingRow = ({
    icon: IconComponent,
    label,
    value,
    onPress,
    showChevron = true,
    iconColor = colors.accent
  }: any) => (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.accent + '15' }]}>
          <IconComponent color={iconColor} size={20} strokeWidth={2} />
        </View>
        <ThemedText style={[styles.settingLabel, { color: colors.text }]}>{label}</ThemedText>
      </View>
      <View style={styles.settingRowRight}>
        {value && <Text style={[styles.settingValue, { color: colors.secondaryText }]}>{value}</Text>}
        {showChevron && <ChevronRight color={colors.border} size={20} />}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Compact Header */}
      <View style={[styles.headerContainer, { backgroundColor: colors.accent }]}>
        <View style={[styles.headerPadding, { paddingTop: Math.max(insets.top, 24) + 16, backgroundColor: colors.accent }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Settings
                color={theme === 'light' ? colors.gold : colors.cream}
                size={24}
                strokeWidth={2}
              />
              <View style={styles.titleTextContainer}>
                <Text style={[styles.headerTitle, { color: theme === 'light' ? colors.gold : colors.cream }]}>
                  {t('settings')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Settings */}
        <SectionHeader title={t('theme')} />
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <SettingRow
            icon={Sun}
            label={t('themeLight')}
            onPress={() => setTheme('light')}
            showChevron={false}
            value={themeMode === 'light' ? '✓' : ''}
            iconColor={themeMode === 'light' ? colors.gold : colors.accent}
          />
          <SettingRow
            icon={Moon}
            label={t('themeDark')}
            onPress={() => setTheme('dark')}
            showChevron={false}
            value={themeMode === 'dark' ? '✓' : ''}
            iconColor={themeMode === 'dark' ? colors.gold : colors.accent}
          />
          <SettingRow
            icon={Smartphone}
            label={t('themeSystem')}
            onPress={() => setTheme('system')}
            showChevron={false}
            value={themeMode === 'system' ? '✓' : ''}
            iconColor={themeMode === 'system' ? colors.gold : colors.accent}
          />
        </View>

        <SectionHeader title={t('language')} />
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <SettingRow
            icon={Globe}
            label={t('languageEnglish')}
            onPress={() => setLanguage('en')}
            showChevron={false}
            value={language === 'en' ? '✓' : ''}
          />
          <SettingRow
            icon={Globe}
            label={t('languageOromo')}
            onPress={() => setLanguage('om')}
            showChevron={false}
            value={language === 'om' ? '✓' : ''}
          />
        </View>

        {/* Information */}
        <SectionHeader title={t('aboutApp')} />
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <SettingRow
            icon={Info}
            label={t('about')}
            onPress={() => setAboutVisible(true)}
            value={`v1.0.0`}
          />
          <SettingRow
            icon={User}
            label={t('developer')}
            onPress={() => setDeveloperVisible(true)}
          />
          <SettingRow
            icon={Mail}
            label={t('reportErrors')}
            onPress={() => handleLink('mailto:solomonamanuel66@gmail.com')}
          />
        </View>

        {/* Blessing Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondaryText }]}>
            {t('footer')}
          </Text>
          <Text style={[styles.blessingText, { color: colors.richGreen }]}>
            {t('blessing')}
          </Text>
        </View>

        <View style={{ height: Math.max(insets.bottom, 40) }} />
      </ScrollView>

      {/* About Modal */}
      <Modal visible={aboutVisible} animationType="fade" transparent onRequestClose={() => setAboutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Image source={require('@/assets/images/logo-transparent.png')} style={styles.modalLogo} resizeMode="contain" />
            <ThemedText style={[styles.modalTitle, { color: colors.accent }]}>Waaqa Faarsina</ThemedText>
            <ThemedText style={[styles.modalVersion, { color: colors.secondaryText }]}>Version 1.0.0</ThemedText>
            <View style={[styles.modalDivider, { backgroundColor: colors.gold }]} />
            <Text style={[styles.modalText, { color: colors.text }]}>
              {t('footer')}
            </Text>
            <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: colors.accent }]} onPress={() => setAboutVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Developer Modal */}
      <Modal visible={developerVisible} animationType="fade" transparent onRequestClose={() => setDeveloperVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.modalAvatar, { borderColor: colors.accent, backgroundColor: colors.accent + '10' }]}>
              <Image source={require('@/assets/images/dev.jpg')} style={styles.avatarImage} resizeMode="cover" />
            </View>
            <ThemedText style={[styles.modalTitle, { color: colors.accent, textAlign: 'center' }]}>Amanuel Solomon</ThemedText>
            <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>Full Stack/Mobile App developer</Text>
            <TouchableOpacity
              style={[styles.contactBtn, { borderColor: colors.accent }]}
              onPress={() => handleLink('mailto:solomonamanuel66@gmail.com')}
            >
              <Mail color={colors.accent} size={18} />
              <Text style={[styles.contactBtnText, { color: colors.accent }]}>solomonamanuel66@gmail.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: colors.accent, marginTop: 24 }]} onPress={() => setDeveloperVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
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
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  settingsGroup: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  settingRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  blessingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    lineHeight: 26,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  modalVersion: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  modalDivider: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalCloseBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
});
