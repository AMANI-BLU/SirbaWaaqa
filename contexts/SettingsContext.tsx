import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const SETTINGS_KEY = '@sirba_settings';

export type FontFamilyPreference = 'Outfit' | 'System';

interface AppSettings {
    fontSizeScale: number;
    fontFamilyPreference: FontFamilyPreference;
}

const DEFAULT_SETTINGS: AppSettings = {
    fontSizeScale: 1.0,
    fontFamilyPreference: 'Outfit',
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isSettingsLoading, setIsSettingsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsSettingsLoading(false);
        }
    };

    const saveSettings = async (newSettings: AppSettings) => {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const updateFontSizeScale = useCallback((scale: number) => {
        setSettings(prev => {
            // Clamp between 0.8 and 2.0
            const clamped = Math.max(0.8, Math.min(2.0, scale));
            const updated = { ...prev, fontSizeScale: clamped };
            saveSettings(updated);
            return updated;
        });
    }, []);

    const updateFontFamily = useCallback((family: FontFamilyPreference) => {
        setSettings(prev => {
            const updated = { ...prev, fontFamilyPreference: family };
            saveSettings(updated);
            return updated;
        });
    }, []);

    return {
        ...settings,
        isSettingsLoading,
        updateFontSizeScale,
        updateFontFamily,
    };
});
