/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// --- Palet Warna Utama (Refined for Modern UI) ---
// LIGHT MODE: Slate Blue & Indigo
// DARK MODE: Deep Navy & Amber
const COLOR_PURPLE = '#059669'; // Emerald/Forest
const COLOR_ORANGE = '#D97706'; // Terracotta
const COLOR_DARK_PURPLE = '#1A2F23'; // Deep Moss
const COLOR_SOFT_CREAM = '#F8FAFC';  // Slate-50: Background sangat bersih
const COLOR_WARM_GRAY = '#64748B';   // Slate-500: Standar desain modern
const COLOR_LIGHT_LAVENDER = '#EEF2FF'; // Indigo-50: Background aksen yang lembut

// Warna Utama (Tint)
const tintColorLight = COLOR_PURPLE; // Indigo
const tintColorDark = COLOR_ORANGE;  // Amber (Kontras tinggi di gelap)

export const Colors = {
  light: {
    text: '#0F172A',         // Slate-900: Deep contrast
    background: '#FFFFFF',   // Pure White
    cardBackground: '#F1F5F9', // Slate-100: Definisi card yang soft

    // Card Khusus - Pastel modern (Desaturasi)
    cardPoint: '#FFFBEB',    // Amber light
    cardSoal: '#F5F3FF',     // Violet light

    // Status - Balanced colors
    status: {
      success: '#10B981',    // Emerald
      error: '#EF4444',      // Rose-Red
      warning: '#F59E0B',     // Amber
    },

    tint: tintColorLight,
    icon: '#64748B',         // Slate-500: Neutral gray-blue
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    titikPoin: '#818CF8',    // Indigo-400

    gradientPrimaryStart: '#F472B6',
    gradientPrimaryEnd: '#8B5CF6',

    // Secondary: Electric Blue to Sky (Terasa ringan dan luas)
    gradientSecondaryStart: '#3B82F6',
    gradientSecondaryEnd: '#2DD4BF',

    // Tertiary: Golden Hour (Orange ke Kuning cerah)
    gradientTertiaryStart: '#FBBF24',
    gradientTertiaryEnd: '#F97316',
  },
  dark: {
    text: '#F8FAFC',         // Slate-50: Crisp text
    background: '#020617',   // Slate-950: Sangat deep, memberikan kesan OLED
    cardBackground: '#1E293B', // Slate-800: Kontras elegan dengan background

    // Card Khusus - Rich & Muted
    cardPoint: '#451A03',    // Deep Amber Brown
    cardSoal: '#1E1B4B',     // Deep Indigo

    status: {
      success: '#34D399',
      error: '#F87171',
      warning: '#FBBF24',
    },

    tint: tintColorDark,     // Orange Amber memberikan kesan hangat
    icon: '#94A3B8',         // Slate-400
    tabIconDefault: '#475569',
    tabIconSelected: tintColorDark,
    titikPoin: '#F59E0B',

    // Primary: Slate-800 to Slate-900 (Glassmorphism look)
    gradientPrimaryStart: '#7C3AED',
    gradientPrimaryEnd: '#2563EB',

    // Secondary: Emerald Glow (Hijau neon yang elegan di layar gelap)
    gradientSecondaryStart: '#10B981',
    gradientSecondaryEnd: '#064E3B',

    // Tertiary: Cyber Teal (Modern, menggantikan Merah/Hitam yang tadi)
    gradientTertiaryStart: '#14B8A6',
    gradientTertiaryEnd: '#0D9488',
  },
};


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` - Cocok untuk kesan buku/klasik */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    // Menggunakan serif untuk kesan klasik
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    // Menggunakan font serif untuk kesan buku yang lebih kuat
    sans: "Georgia, 'Times New Roman', serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});