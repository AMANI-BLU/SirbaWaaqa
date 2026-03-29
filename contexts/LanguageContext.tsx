import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const LANGUAGE_KEY = '@sirba_language';

type Language = 'en' | 'om';

type Translations = {
  [key: string]: {
    en: string;
    om: string;
  };
};

const translations: Translations = {
  appTitle: { en: 'Waaqa Faarsina', om: 'Waaqa Faarsina' },
  appSubtitle: { en: 'Oromo(Borana) Gospel Songs', om: 'Faarfannaa Afaan Oromoo' },
  appDescription: { en: 'Oromo Hymn Book', om: 'Kitaaba Faarfannaa Afaan Oromoo' },

  tabSongs: { en: 'Songs', om: 'Faarfannaa' },
  tabFavorites: { en: 'Favorites', om: 'Jaallatamoo' },
  tabAbout: { en: 'About', om: 'Waaʼee' },
  tabSettings: { en: 'Settings', om: 'Sajata' },

  searchPlaceholder: { en: 'Search by number, title...', om: 'Barbaadi lakkoofsa, mataduree...' },
  songsCount: { en: 'songs', om: 'faarfannoota' },
  songCount: { en: 'song', om: 'faarfannaa' },

  favorites: { en: 'Favorites', om: 'Jaallatamoo' },
  settings: { en: 'Settings', om: 'Sajata' },
  savedSongs: { en: 'Your saved songs', om: 'Faarfannoota kee olkaaʼame' },
  noFavorites: { en: 'No Favorites', om: 'Jaallatamoon hin jiru' },
  noFavoritesDesc: { en: 'Tap the heart icon on any song to add it to your favorites', om: 'Faarfannaa kamiyyuu irratti mallattoo onnee tuqiitii jaallatamoo keessanitti idaʼaa' },
  favoriteCount: { en: 'favorites', om: 'jaallatamoo' },
  favoriteCountSingle: { en: 'favorite', om: 'jaallatamaa' },

  about: { en: 'About', om: 'Waaʼee' },
  version: { en: 'Version', om: 'Fooyya\'ina' },

  theme: { en: 'Theme', om: 'Bifata' },
  themeLight: { en: 'Light', om: 'Ifa' },
  themeDark: { en: 'Dark', om: 'Dukkana' },
  themeSystem: { en: 'System', om: 'Sirna' },

  language: { en: 'Language', om: 'Afaan' },
  languageEnglish: { en: 'English', om: 'Ingiliffaa' },
  languageOromo: { en: 'Afan Oromo', om: 'Afaan Oromoo' },

  appFont: { en: 'App Font', om: 'Bifata Qubee' },
  fontOutfit: { en: 'Outfit (Default)', om: 'Outfit (Dhaabbata)' },
  fontInter: { en: 'Inter (Clean)', om: 'Inter (Qulqulluu)' },
  fontPoppins: { en: 'Poppins (Modern)', om: 'Poppins (Amayyaa)' },
  fontSystem: { en: 'System Default', om: 'Dhaabbata Sirnaa' },

  aboutApp: { en: 'About This App', om: 'Waaʼee Appii Kanaa' },
  aboutDesc: { en: 'Waaqa Faarsina is built in memory of gospel fathers and mothers who spread the gospel in Borana. They used the manual hymn book as a spiritual tool for songs. Our mission is to digitalize this sacred book and make it accessible to everyone, ensuring these spiritual songs are preserved for generations.', om: 'Waaqa Faarsinaa kan ijaarame yaadannoo abbootii fi haadhota wangeelaa Boorana keessatti wangeela babal\'isaniitiif. Isaan kitaaba faarfannaa harkaa akka meeshaa hafuuraatti tajaajilamaa turan. Kaayyoon keenya kitaaba qulqulluu kana gara dijitaalaatti jijjiiruun hundaaf akka dandaʼamu taasisuu fi faarfannaa hafuuraa dhalootaaf tursiisuu dha.' },

  features: { en: 'Features', om: 'Amaloota' },
  featureLibraryTitle: { en: 'Complete Hymn Book', om: 'Kitaaba Faarfannaa Guutuu' },
  featureLibraryDesc: { en: 'Access a wide collection of traditional Oromo hymns. All lyrics are provided in Afan Oromo.', om: 'Faarfannoota aadaa Afaan Oromoo bayʼee qabu argadhaa. Jechoonni hundi Afaan Oromoottiin kennamaniiru.' },
  featureFavoritesTitle: { en: 'Favorites', om: 'Jaallatamoo' },
  featureFavoritesDesc: { en: 'Save your favorite songs for quick access. Create a personal collection for worship.', om: 'Faarfannoota jaalattan salphaatti argachuuf olkaaʼaa. Kuufama dhuunfaa waaqeffannaaf uumadhaa.' },

  developer: { en: 'Developer', om: 'Hojjetaa' },
  madeWithLove: { en: 'Software Engineer', om: 'Injiinara Sooftweerii' },
  contactDeveloper: { en: 'Contact Developer', om: 'Hojjetaa Quunnamaa' },

  reportErrors: { en: 'Report Errors', om: 'Dogoggora Gabaasa' },
  foundError: { en: 'Found an Error?', om: 'Dogoggora Argitee?' },
  foundErrorDesc: { en: 'If you find incorrect lyrics or other issues, please let us know. Help us improve this app.', om: 'Yoo jecha dogoggoraa ykn dhimma biroo argite, nutti himaa. Appii kana fooyessuu keessatti nu gargaaraa.' },
  sendReport: { en: 'Send Report', om: 'Gabaasa Ergi' },

  sortNumerical: { en: 'Numerical Order', om: 'Lakkoofsaan' },
  sortCustom: { en: 'Default Order', om: 'Hubannoo Dhaabbataa' },

  footer: { en: 'Waaqa Faarsina is built in memory of gospel fathers and mothers who spread the gospel in Borana. They used the manual hymn book as a spiritual tool for songs. Our mission is to digitalize this sacred book and make it accessible to everyone, ensuring these spiritual songs are preserved for generations.', om: 'Waaqa Faarsinaa kan ijaarame yaadannoo abbootii fi haadhota wangeelaa Boorana keessatti wangeela babal\'isaniitiif. Isaan kitaaba faarfannaa harkaa akka meeshaa hafuuraatti tajaajilamaa turan. Kaayyoon keenya kitaaba qulqulluu kana gara dijitaalaatti jijjiiruun hundaaf akka dandaʼamu taasisuu fi faarfannaa hafuuraa dhalootaaf tursiisuu dha.' },
  blessing: { en: '✝ God bless you ✝', om: '✝ Waaqayyoo isin haa eebbisu ✝' },
};

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored && (stored === 'en' || stored === 'om')) {
        setLanguageState(stored);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLanguage = async (newLang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const t = useCallback((key: keyof typeof translations): string => {
    return (translations[key] as any)?.[language] || key;
  }, [language]);

  return {
    language,
    setLanguage,
    t,
    isLoading,
  };
});
