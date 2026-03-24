const fs = require('fs');

let about = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx', 'utf8');
if (!about.includes('useSettings')) {
    about = about.replace(
        "import { useTheme } from '@/contexts/ThemeContext';",
        "import { useTheme } from '@/contexts/ThemeContext';\nimport { useSettings } from '@/contexts/SettingsContext';"
    );
    about = about.replace(
        "const { language, setLanguage, t } = useLanguage();",
        "const { language, setLanguage, t } = useLanguage();\n  const { fontSizeScale, updateFontSizeScale, fontFamilyPreference, updateFontFamily } = useSettings();"
    );

    const target = `<View style={styles.section}>\n          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</ThemedText>`;
    const targetFallback = `<View style={styles.section}>\n          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>`;

    const ui = `
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Typography Settings</ThemedText>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => updateFontSizeScale(fontSizeScale - 0.1)}
            >
              <ThemedText style={{ color: colors.text }}>Size A-</ThemedText>
            </TouchableOpacity>
            <ThemedText style={{ color: colors.accent, alignSelf: 'center', marginHorizontal: 8, fontWeight: 'bold' }}>
              {fontSizeScale.toFixed(1)}x
            </ThemedText>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => updateFontSizeScale(fontSizeScale + 0.1)}
            >
              <ThemedText style={{ color: colors.text }}>Size A+</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.optionsContainer, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }, fontFamilyPreference === 'Outfit' && { borderColor: colors.gold, backgroundColor: colors.cream }]}
              onPress={() => updateFontFamily('Outfit')}
            >
              <ThemedText style={{ color: fontFamilyPreference === 'Outfit' ? colors.gold : colors.text }}>Font: Outfit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }, fontFamilyPreference === 'System' && { borderColor: colors.gold, backgroundColor: colors.cream }]}
              onPress={() => updateFontFamily('System')}
            >
              <ThemedText style={{ color: fontFamilyPreference === 'System' ? colors.gold : colors.text }}>Font: System</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />\n`;

    if (about.includes(target)) {
        about = about.replace(target, ui + target);
    } else if (about.includes(targetFallback)) {
        about = about.replace(targetFallback, ui.replace(/ThemedText/g, 'Text') + targetFallback);
    }
    fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx', about, 'utf8');
}

let hymn = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', 'utf8');
if (!hymn.includes('useSettings')) {
    hymn = hymn.replace(
        "import { useTheme } from '@/contexts/ThemeContext';",
        "import { useTheme } from '@/contexts/ThemeContext';\nimport { useSettings } from '@/contexts/SettingsContext';"
    );
    hymn = hymn.replace(
        "const { isFavorite, toggleFavorite } = useFavorites();",
        "const { isFavorite, toggleFavorite } = useFavorites();\n  const { fontSizeScale, updateFontSizeScale } = useSettings();"
    );

    const rightHeaderRegex = /headerRight: \(\) => \([\s\S]*?fill=\{isFav \? iconColor : 'transparent'\}[\s\S]*?\),/;
    const rightHeaderRegex2 = /headerRight: \(\) => \([\s\S]*?fill=\{isFavorite \? colors\.gold : 'transparent'\}[\s\S]*?\),/;

    const injection = `headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <TouchableOpacity onPress={() => updateFontSizeScale(fontSizeScale - 0.1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <ThemedText style={{ color: iconColor, fontSize: 18, fontFamily: 'Outfit_700Bold' }}>A-</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateFontSizeScale(fontSizeScale + 0.1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginRight: 8 }}>
                <ThemedText style={{ color: iconColor, fontSize: 18, fontFamily: 'Outfit_700Bold' }}>A+</ThemedText>
              </TouchableOpacity>
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
            </View>
          ),`;

    if (rightHeaderRegex.test(hymn)) {
        hymn = hymn.replace(rightHeaderRegex, injection);
    } else if (rightHeaderRegex2.test(hymn)) {
        hymn = hymn.replace(rightHeaderRegex2, injection);
    }
    fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', hymn, 'utf8');
}
