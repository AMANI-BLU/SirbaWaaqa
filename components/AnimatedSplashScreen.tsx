import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
    onAnimationComplete: () => void;
    onReady?: () => void;
}

export const AnimatedSplashScreen: React.FC<Props> = ({ onAnimationComplete, onReady }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const logoScale = useSharedValue(0.6);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // Notify that we are ready to take over from native splash
        if (onReady) {
            onReady();
        }

        // Stage 1: Fade in logo and scale up
        logoScale.value = withTiming(1, { duration: 1200 });
        logoOpacity.value = withTiming(1, { duration: 1000 });

        // Stage 2: Fade in text
        textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));

        // Stage 3: Close the curtain
        const timeout = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
                if (finished) {
                    runOnJS(onAnimationComplete)();
                }
            });
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: withTiming(textOpacity.value === 1 ? 0 : 15) }]
    }));

    const containerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        backgroundColor: isDark ? '#1C1410' : '#FFFFFF',
    }));

    // Adaptive text colors for readability
    const titleColor = isDark ? '#D4AF37' : '#8B6D1B';
    const subtitleColor = isDark ? '#A88B6F' : '#5D4B3B';

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.content}>
                <Animated.View style={logoStyle}>
                    <Image
                        source={require('../assets/images/splash-icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>
                <Animated.View style={[styles.footer, textStyle]}>
                    <Text style={[styles.brandTitle, { color: titleColor }]}>Waaqa Faarsina</Text>
                    <Text style={[styles.brandSubtitle, { color: subtitleColor }]}>Gospel Song</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.45,
        height: width * 0.45,
        marginBottom: 24,
    },
    footer: {
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 1.5,
        fontFamily: 'Outfit_800ExtraBold',
    },
    brandSubtitle: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 10,
        fontFamily: 'Outfit_500Medium',
    },
});
