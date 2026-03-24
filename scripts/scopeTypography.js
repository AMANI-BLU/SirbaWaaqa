const fs = require('fs');

// 1. Completely restore components/ThemedText.tsx
const ThemedTextCode = `import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = RNTextProps;

export function ThemedText({ style, ...rest }: ThemedTextProps) {
  const flatStyle = StyleSheet.flatten(style) || {};
  const weight = flatStyle.fontWeight?.toString() || '400';
  
  let fontFamily = 'Outfit_400Regular';

  if (weight === '500') fontFamily = 'Outfit_500Medium';
  else if (weight === '600' || weight === 'bold') fontFamily = 'Outfit_600SemiBold';
  else if (weight === '700') fontFamily = 'Outfit_700Bold';
  else if (weight === '800' || weight === '900') fontFamily = 'Outfit_800ExtraBold';

  return <RNText style={[flatStyle, { fontFamily, fontWeight: undefined }]} {...rest} />;
}
`;
fs.writeFileSync('d:\\SirbaWaaqaProject\\components\\ThemedText.tsx', ThemedTextCode, 'utf8');

// 2. Update app/hymn/[id].tsx
let hymn = fs.readFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', 'utf8');

if (!hymn.includes('Text,')) {
    hymn = hymn.replace('ScrollView,', 'ScrollView,\n  Text,');
}

hymn = hymn.replace(
    'const { fontSizeScale, updateFontSizeScale } = useSettings();',
    'const { fontSizeScale, updateFontSizeScale, fontFamilyPreference } = useSettings();'
);

const lyricsMapRegex = /\{hymn\.lyrics\.map\(\(line, index\) => \([\s\S]*?<\/ThemedText>\s*\)\)\}/;
const replacement = `{hymn.lyrics.map((line, index) => {
              const baseSize = 18;
              const scaledSize = baseSize * fontSizeScale;
              const isSys = fontFamilyPreference === 'System';
              return (
                <Text
                  key={index}
                  style={[
                    styles.lyricLine,
                    { 
                      color: colors.text, 
                      fontSize: scaledSize, 
                      fontFamily: isSys ? undefined : 'Outfit_400Regular',
                      fontWeight: isSys ? '400' : undefined,
                      lineHeight: scaledSize * 1.5,
                    },
                    line === '' && styles.lyricLineEmpty,
                  ]}
                >
                  {line || ' '}
                </Text>
              );
            })}`;
hymn = hymn.replace(lyricsMapRegex, replacement);

fs.writeFileSync('d:\\SirbaWaaqaProject\\app\\hymn\\[id].tsx', hymn, 'utf8');
