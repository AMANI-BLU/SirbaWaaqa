import { cacheDirectory, copyAsync } from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 48;
const CARD_H = CARD_W * 1.5;

const PRESET_BACKGROUNDS = [
    { id: 'nature', source: require('@/assets/images/bg_nature.png'), label: '🌿 Nature' },
    { id: 'worship', source: require('@/assets/images/bg_worship.png'), label: '✨ Light' },
    { id: 'stars', source: require('@/assets/images/bg_stars.png'), label: '🌌 Stars' },
    { id: 'flowers', source: require('@/assets/images/bg_flowers.png'), label: '🌸 Flowers' },
];

interface HymnImageCreatorProps {
    visible: boolean;
    onClose: () => void;
    hymn: { number: number; title: string; lyrics: string[] };
    initialLyrics?: string;
    colors: any;
    theme: 'light' | 'dark';
}

export function HymnImageCreator({ visible, onClose, hymn, initialLyrics, colors, theme: appTheme }: HymnImageCreatorProps) {
    const insets = useSafeAreaInsets();
    const shotRef = useRef<ViewShot>(null);

    // All lyrics joined as fallback
    const fullLyrics = hymn.lyrics.join('\n');

    const [selectedBg, setSelectedBg] = useState<any>(PRESET_BACKGROUNDS[0].source);
    const [customBgUri, setCustomBgUri] = useState<string | null>(null);
    const [darkAmount, setDarkAmount] = useState(30);
    const [fontSize, setFontSize] = useState(15);
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
    const [editableLyrics, setEditableLyrics] = useState(initialLyrics && initialLyrics.trim() !== "" ? initialLyrics : fullLyrics);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'bg' | 'style' | 'blur'>('bg');
    const [selectedFont, setSelectedFont] = useState<'Outfit' | 'Inter' | 'Poppins' | 'System'>('Outfit');

    // Update lyrics when modal opens with new selection
    useEffect(() => {
        if (visible) {
            setEditableLyrics(initialLyrics && initialLyrics.trim() !== "" ? initialLyrics : fullLyrics);
        }
    }, [visible, initialLyrics, fullLyrics]);

    const currentBg = customBgUri ? { uri: customBgUri } : selectedBg;

    const pickFromGallery = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert('Permission needed', 'Please allow access to your photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });
        if (!result.canceled && result.assets[0]) {
            setCustomBgUri(result.assets[0].uri);
            setSelectedBg(null);
        }
    };

    const saveToGallery = async () => {
        if (!shotRef.current) return;
        try {
            setIsSaving(true);
            await new Promise((r) => setTimeout(r, 300)); // let UI settle before capture
            const uri = await (shotRef.current as any).capture();

            // Rename file for a better share experience
            const cleanTitle = hymn.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const newUri = `${cacheDirectory}Hymn_${hymn.number}_${cleanTitle}.png`;
            await copyAsync({ from: uri, to: newUri });

            setIsSaving(false);
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(newUri, {
                    mimeType: 'image/png',
                    dialogTitle: `Share ${hymn.title}`,
                    UTI: 'public.png',
                });
            } else {
                Alert.alert('Sharing not available', 'Your device does not support sharing.');
            }
        } catch (e: any) {
            setIsSaving(false);
            console.error('Save failed', e);
            Alert.alert('Error', e?.message || 'Could not capture image. Please try again.');
        }
    };

    const isDark = appTheme === 'dark';

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.modalRoot, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
                <StatusBar style="light" />
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Create Image</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color={colors.text} size={22} strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Preview Card (Captured by ViewShot) */}
                    <ViewShot
                        ref={shotRef}
                        options={{ format: 'png', quality: 1 }}
                        style={[styles.cardWrapper, { width: CARD_W, minHeight: CARD_H }]}
                    >
                        {/* Background */}
                        <Image source={currentBg} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

                        {/* Overlay */}
                        <View
                            style={[
                                StyleSheet.absoluteFillObject,
                                { backgroundColor: `rgba(0,0,0,${(darkAmount / 100) * 0.85})` }
                            ]}
                        />

                        {/* Card content */}
                        <View style={styles.cardContent}>
                            {/* Glass Effect Container */}
                            <View style={[styles.glassContainer, { backgroundColor: `rgba(255,255,255,${(100 - darkAmount) / 400})` }]}>
                                {/* Decoration: Quote Icon */}
                                <View style={styles.quoteIconContainer}>
                                    <Text style={styles.quoteLeft}>“</Text>
                                </View>

                                {/* Title */}
                                <Text style={[styles.cardTitle, {
                                    fontFamily: selectedFont === 'Inter' ? 'Inter_700Bold' : selectedFont === 'Poppins' ? 'Poppins_700Bold' : selectedFont === 'System' ? undefined : 'Outfit_700Bold'
                                }]}>{hymn.title}</Text>

                                {/* Elegant Divider */}
                                <View style={styles.elegantDivider}>
                                    <View style={[styles.dividerLine, { backgroundColor: colors.gold }]} />
                                    <View style={[styles.dividerDot, { backgroundColor: colors.gold }]} />
                                    <View style={[styles.dividerLine, { backgroundColor: colors.gold }]} />
                                </View>

                                {/* Context badge */}
                                <View style={[styles.numberBadge, { backgroundColor: colors.gold + '20' }]}>
                                    <Text style={[styles.numberText, {
                                        color: colors.gold,
                                        fontFamily: selectedFont === 'Inter' ? 'Inter_700Bold' : selectedFont === 'Poppins' ? 'Poppins_700Bold' : selectedFont === 'System' ? undefined : 'Outfit_700Bold'
                                    }]}>DAILY VERSE</Text>
                                </View>

                                {/* ✅ Editable lyrics TextInput */}
                                <TextInput
                                    value={editableLyrics}
                                    onChangeText={setEditableLyrics}
                                    multiline
                                    scrollEnabled={false}
                                    style={[styles.cardLyrics, {
                                        fontSize,
                                        lineHeight: fontSize * 1.6,
                                        textAlign,
                                        fontFamily: selectedFont === 'Inter' ? 'Inter_400Regular' : selectedFont === 'Poppins' ? 'Poppins_400Regular' : selectedFont === 'System' ? undefined : 'Outfit_500Medium'
                                    }]}
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    placeholder="Type or paste lyrics…"
                                />

                                <View style={styles.quoteIconContainerRight}>
                                    <Text style={styles.quoteRight}>”</Text>
                                </View>
                            </View>

                            {/* Watermark + App Info */}
                            <View style={styles.watermarkContainer}>
                                <Image
                                    source={require('@/assets/images/logo-transparent.png')}
                                    style={styles.watermarkLogo}
                                    resizeMode="contain"
                                />
                                <View>
                                    <Text style={styles.cardWatermark}>Waaqa Faarsina</Text>
                                    <Text style={styles.cardSubWatermark}>Waaqa Faarsina App</Text>
                                </View>
                            </View>
                        </View>
                    </ViewShot>

                    {/* Hint */}
                    <Text style={[styles.editHint, { color: colors.text + '60' }]}>✏️  Tap the lyrics above to edit them</Text>

                    {/* Tab Bar */}
                    <View style={[styles.tabBar, { backgroundColor: colors.cardBackground }]}>
                        {[
                            { id: 'bg', icon: '🖼', label: 'Background' },
                            { id: 'blur', icon: '🌫', label: 'Overlay' },
                            { id: 'style', icon: '🎨', label: 'Style' },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tabItem, activeTab === tab.id && { backgroundColor: colors.accent }]}
                                onPress={() => setActiveTab(tab.id as any)}
                            >
                                <Text style={styles.tabIcon}>{tab.icon}</Text>
                                <Text style={[styles.tabLabel, activeTab === tab.id ? { color: isDark ? '#000000' : '#ffffff' } : { color: colors.text, opacity: 0.6 }]}>{tab.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tab Content */}
                    <View style={styles.tabContent}>
                        {activeTab === 'bg' && (
                            <View>
                                <View style={styles.presetGrid}>
                                    {PRESET_BACKGROUNDS.map((bg) => (
                                        <TouchableOpacity
                                            key={bg.id}
                                            onPress={() => { setSelectedBg(bg.source); setCustomBgUri(null); }}
                                            style={[
                                                styles.presetThumb,
                                                selectedBg === bg.source && !customBgUri && styles.presetThumbSelected,
                                            ]}
                                        >
                                            <Image source={bg.source} style={styles.presetThumbImg} resizeMode="cover" />
                                            <Text style={styles.presetLabel}>{bg.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity style={[styles.galleryBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]} onPress={pickFromGallery}>
                                    <Text style={[styles.galleryBtnText, { color: colors.text + 'e0' }]}>📷  Choose from Phone Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {activeTab === 'blur' && (
                            <View style={styles.sliderSection}>
                                <Text style={[styles.sliderLabel, { color: colors.text + 'b0' }]}>Background Darkness: {darkAmount}%</Text>
                                <View style={styles.sliderRow}>
                                    <TouchableOpacity style={[styles.sliderBtn, { backgroundColor: colors.cardBackground }]} onPress={() => setDarkAmount(Math.max(0, darkAmount - 5))}>
                                        <Text style={[styles.sliderBtnText, { color: colors.text }]}>−</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
                                        <View style={[styles.sliderFill, { width: `${darkAmount}%`, backgroundColor: colors.accent }]} />
                                    </View>
                                    <TouchableOpacity style={[styles.sliderBtn, { backgroundColor: colors.cardBackground }]} onPress={() => setDarkAmount(Math.min(100, darkAmount + 5))}>
                                        <Text style={[styles.sliderBtnText, { color: colors.text }]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {activeTab === 'style' && (
                            <View style={styles.sliderSection}>
                                <Text style={[styles.sliderLabel, { color: colors.text + 'b0' }]}>Alignment</Text>
                                <View style={[styles.presetNumbers, { marginBottom: 24 }]}>
                                    {([
                                        { id: 'left', icon: 'left' },
                                        { id: 'center', icon: 'center' },
                                        { id: 'right', icon: 'right' },
                                        { id: 'justify', icon: 'justify' }
                                    ] as const).map((align) => (
                                        <TouchableOpacity
                                            key={align.id}
                                            style={[styles.presetNum, textAlign === align.id ? { backgroundColor: colors.accent } : { backgroundColor: colors.cardBackground }]}
                                            onPress={() => setTextAlign(align.id)}
                                        >
                                            <Text style={[styles.presetNumText, textAlign === align.id ? { color: isDark ? '#000000' : '#ffffff' } : { color: colors.text, opacity: 0.7 }, { textTransform: 'capitalize' }]}>
                                                {align.id}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={[styles.sliderLabel, { color: colors.text + 'b0' }]}>Verse Font Size: {fontSize}px</Text>
                                <View style={styles.sliderRow}>
                                    <TouchableOpacity
                                        style={[styles.sliderBtn, { backgroundColor: colors.cardBackground }]}
                                        onPress={() => setFontSize(Math.max(10, fontSize - 1))}
                                    >
                                        <Text style={[styles.sliderBtnText, { color: colors.text }]}>-</Text>
                                    </TouchableOpacity>

                                    <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
                                        <View style={[styles.sliderFill, { width: `${((fontSize - 10) / 15) * 100}%`, backgroundColor: colors.accent }]} />
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.sliderBtn, { backgroundColor: colors.cardBackground }]}
                                        onPress={() => setFontSize(Math.min(25, fontSize + 1))}
                                    >
                                        <Text style={[styles.sliderBtnText, { color: colors.text }]}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.sliderLabel, { color: colors.text + 'b0', marginTop: 12 }]}>Font Family</Text>
                                <View style={styles.fontGrid}>
                                    {([
                                        { id: 'Outfit', label: 'Outfit' },
                                        { id: 'Inter', label: 'Inter' },
                                        { id: 'Poppins', label: 'Poppins' },
                                        { id: 'System', label: 'System' }
                                    ] as const).map((font) => (
                                        <TouchableOpacity
                                            key={font.id}
                                            style={[styles.presetNum, selectedFont === font.id ? { backgroundColor: colors.accent } : { backgroundColor: colors.cardBackground }]}
                                            onPress={() => setSelectedFont(font.id)}
                                        >
                                            <Text style={[styles.presetNumText, selectedFont === font.id ? { color: isDark ? '#000000' : '#ffffff' } : { color: colors.text, opacity: 0.7 }]}>
                                                {font.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: colors.accent }, isSaving && styles.saveBtnDisabled]}
                        onPress={saveToGallery}
                        disabled={isSaving}
                    >
                        <Text style={[styles.saveBtnText, { color: isDark ? '#000000' : '#ffffff' }]}>{isSaving ? 'Processing...' : 'Save & Share'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalRoot: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    headerTitle: {
        color: '#fff',
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    cardWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginBottom: 12,
    },
    cardContent: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassContainer: {
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 32,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
    },
    quoteIconContainer: {
        position: 'absolute',
        top: 10,
        left: 20,
    },
    quoteIconContainerRight: {
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    quoteLeft: {
        fontSize: 60,
        color: 'rgba(255,255,255,0.15)',
        fontFamily: 'serif',
        lineHeight: 80,
    },
    quoteRight: {
        fontSize: 60,
        color: 'rgba(255,255,255,0.15)',
        fontFamily: 'serif',
        lineHeight: 60,
    },
    numberBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    numberText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 10,
        letterSpacing: 2,
    },
    cardTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 16,
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    elegantDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dividerLine: {
        width: 30,
        height: 1,
        opacity: 0.5,
    },
    dividerDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    cardLyrics: {
        fontFamily: 'Outfit_500Medium',
        textAlign: 'center',
        width: '100%',
        padding: 0,
        color: '#ffffff',
    },
    watermarkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 12,
    },
    watermarkLogo: {
        width: 36,
        height: 36,
        opacity: 0.8,
    },
    cardWatermark: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 14,
        color: '#ffffff',
    },
    cardSubWatermark: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        marginTop: -2,
    },

    editHint: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        marginBottom: 16,
    },

    // Tabs
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
        width: CARD_W,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 3,
    },
    tabItemActive: {
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    tabIcon: { fontSize: 18 },
    tabLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontFamily: 'Outfit_500Medium',
        fontSize: 11,
    },
    tabLabelActive: { color: '#fff' },
    tabContent: { width: CARD_W, paddingBottom: 12 },

    // Backgrounds
    presetGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    presetThumb: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    presetThumbSelected: { borderColor: '#f5c842' },
    presetThumbImg: { width: '100%', height: 70 },
    presetLabel: {
        color: '#fff',
        fontFamily: 'Outfit_500Medium',
        fontSize: 10,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 4,
    },
    galleryBtn: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderStyle: 'dashed',
    },
    galleryBtnText: {
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
    },

    // Sliders
    sliderSection: { width: '100%' },
    sliderLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    fontGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    sliderBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderBtnText: {
        color: '#fff',
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
    },
    sliderTrack: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: '#f5c842',
        borderRadius: 3,
    },
    presetNumbers: {
        flexDirection: 'row',
        gap: 8,
    },
    presetNum: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    presetNumActive: { backgroundColor: '#f5c842' },
    presetNumText: {
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
    },
    presetNumTextActive: { color: '#000' },

    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    saveBtn: {
        backgroundColor: '#f5c842',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: {
        color: '#1a1400',
        fontFamily: 'Outfit_700Bold',
        fontSize: 17,
    },
});
