import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

export type ThemedTextProps = TextProps;

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
