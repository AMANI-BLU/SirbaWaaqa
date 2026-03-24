import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { hymns } from '@/mocks/hymns';
import { Heart } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface HymnCardProps {
    item: typeof hymns[0];
    index: number;
    onPress: (id: number) => void;
    isFavorite?: boolean;
}

const HymnCardComponent = ({ item, index, onPress, isFavorite = false }: HymnCardProps) => {
    const { colors } = useTheme();
    const scaleValue = useRef(new Animated.Value(1)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: 400,
            delay: Math.min(index * 50, 500), // Cap delay to 500ms max
            useNativeDriver: true,
        }).start();
    }, [index, fadeValue]);

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
                onPress={() => onPress(item.id)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.hymnNumber, { backgroundColor: colors.accent }]}>
                        <ThemedText style={[styles.hymnNumberText, { color: colors.cardBackground }]}>
                            {item.number}
                        </ThemedText>
                    </View>
                    <View style={styles.hymnContent}>
                        <ThemedText style={[styles.hymnTitle, { color: colors.text }]} numberOfLines={2}>
                            {item.title}
                        </ThemedText>
                        {item.englishTranslation && (
                            <View style={styles.translationContainer}>
                                <ThemedText style={[styles.translationLabel, { color: colors.accent, opacity: 0.6 }]}>•</ThemedText>
                                <ThemedText style={[styles.hymnTranslation, { color: colors.accent }]} numberOfLines={1}>
                                    {item.englishTranslation}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                    {isFavorite && (
                        <Heart color={colors.deepRed} size={22} strokeWidth={2} fill={colors.deepRed} />
                    )}
                </View>
                <View style={[styles.cardDecoration, { backgroundColor: colors.gold }]} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const HymnCard = React.memo(HymnCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isFavorite === nextProps.isFavorite
    );
});

const styles = StyleSheet.create({
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
        position: 'absolute',
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
