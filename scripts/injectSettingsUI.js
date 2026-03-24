const fs = require('fs');

let about = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx', 'utf8');

// 1. Inject import
about = about.replace(
    "import { useTheme } from '@/contexts/ThemeContext';",
    "import { useTheme } from '@/contexts/ThemeContext';\nimport { useSettings } from '@/contexts/SettingsContext';"
);

// 2. Inject hook hook
about = about.replace(
    "const { language, setLanguage, t } = useLanguage();",
    "const { language, setLanguage, t } = useLanguage();\n  const { fontSizeScale, updateFontSizeScale, fontFamilyPreference, updateFontFamily } = useSettings();"
);

// 3. Inject UI
const typographyUI = `
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Typography</ThemedText>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => updateFontSizeScale(fontSizeScale - 0.1)}
            >
              <ThemedText style={{ color: colors.text }}>A-</ThemedText>
            </TouchableOpacity>
            <ThemedText style={{ color: colors.accent, alignSelf: 'center', marginHorizontal: 16 }}>
              {fontSizeScale.toFixed(1)}x
            </ThemedText>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => updateFontSizeScale(fontSizeScale + 0.1)}
            >
              <ThemedText style={{ color: colors.text }}>A+</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.optionsContainer, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                fontFamilyPreference === 'Outfit' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => updateFontFamily('Outfit')}
            >
              <ThemedText style={{ color: fontFamilyPreference === 'Outfit' ? colors.gold : colors.text }}>
                Outfit
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                fontFamilyPreference === 'System' && { borderColor: colors.gold, backgroundColor: colors.cream },
              ]}
              onPress={() => updateFontFamily('System')}
            >
              <ThemedText style={{ color: fontFamilyPreference === 'System' ? colors.gold : colors.text }}>
                System
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
`;

about = about.replace(
    "<View style={styles.section}>\n          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</ThemedText>",
    typographyUI + "\n        <View style={styles.section}>\n          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</ThemedText>"
);

fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\(tabs)\\about.tsx', about, 'utf8');

// --- Hymn View Header Controls ---
let hymn = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', 'utf8');

// 1. imports
hymn = hymn.replace(
    "import { useTheme } from '@/contexts/ThemeContext';",
    "import { useTheme } from '@/contexts/ThemeContext';\nimport { useSettings } from '@/contexts/SettingsContext';\nimport { TouchableOpacity } from 'react-native';"
);

// 2. hook
hymn = hymn.replace(
    "const { t, language } = useLanguage();",
    "const { t, language } = useLanguage();\n  const { fontSizeScale, updateFontSizeScale } = useSettings();"
);

// 3. headerRight injection
const headerRightCode = `
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => updateFontSizeScale(fontSizeScale - 0.1)}>
            <ThemedText style={{ color: colors.gold, fontSize: 18, fontWeight: 'bold' }}>A-</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateFontSizeScale(fontSizeScale + 0.1)}>
            <ThemedText style={{ color: colors.gold, fontSize: 18, fontWeight: 'bold' }}>A+</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavorite}>
            <Heart
              color={colors.gold}
              fill={isFavorite ? colors.gold : 'transparent'}
              size={24}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      ),
`;

// It currently has headerRight with just Heart
hymn = hymn.replace(
    /headerRight: \(\) => \([\s\S]*?fill=\{isFavorite \? colors\.gold : 'transparent'\}[\s\S]*?\),/,
    headerRightCode
);

fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', hymn, 'utf8');
