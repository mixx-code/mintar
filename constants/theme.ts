/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// --- Palet Warna Utama ---
const COLOR_GUNMETAL = '#2A3439';
const COLOR_BRUSHED_STEEL = '#B8B8B8';
const COLOR_COPPER = '#B87333';
const COLOR_BRONZE = '#CD7F32';
const COLOR_CHROME = '#E8E8E8';
const COLOR_OIL_SLICK = '#2E2E3A';

// Warna Utama (Tint) - metallic
const tintColorLight = COLOR_COPPER;
const tintColorDark = COLOR_BRONZE;

export const Colors = {
  light: {
    // Teks & Background - industrial light
    text: '#1C1C1C',
    background: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
    cardBackground: COLOR_CHROME,

    // Card Khusus - metallic texture
    cardPoint: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
    cardSoal: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',

    // Status - metal tones
    status: {
      success: '#4CAF50', // Hijau standar untuk kontras
      error: '#D32F2F',
      warning: COLOR_COPPER,
    },

    // Aksen & Ikon - industrial
    tint: tintColorLight,
    icon: '#757575',
    tabIconDefault: '#9E9E9E',
    tabIconSelected: tintColorLight,
    titikPoin: COLOR_BRONZE,

    // Gradien - metallic sheen
    gradientPrimaryStart: COLOR_BRUSHED_STEEL,
    gradientPrimaryEnd: COLOR_CHROME,
    gradientSecondaryStart: COLOR_COPPER,
    gradientSecondaryEnd: '#FF9800',
    gradientTertiaryStart: '#9E9E9E',
    gradientTertiaryEnd: '#616161',
  },
  dark: {
    // Teks & Background - factory dark
    text: COLOR_CHROME,
    background: COLOR_GUNMETAL,
    cardBackground: COLOR_OIL_SLICK,

    // Card Khusus
    cardPoint: '#3E2723', // Brown metal
    cardSoal: '#37474F', // Blue gray metal

    // Status
    status: {
      success: '#388E3C',
      error: '#C62828',
      warning: COLOR_BRONZE,
    },

    // Aksen & Ikon
    tint: tintColorDark,
    icon: COLOR_BRUSHED_STEEL,
    tabIconDefault: '#90A4AE',
    tabIconSelected: tintColorDark,
    titikPoin: COLOR_COPPER,

    // Gradien - industrial dark
    gradientPrimaryStart: COLOR_GUNMETAL,
    gradientPrimaryEnd: COLOR_OIL_SLICK,
    gradientSecondaryStart: COLOR_BRONZE,
    gradientSecondaryEnd: '#8D6E63',
    gradientTertiaryStart: '#546E7A',
    gradientTertiaryEnd: '#37474F',
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