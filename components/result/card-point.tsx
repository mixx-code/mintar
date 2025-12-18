import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

// --- ASUMSI IMPORT WARNA TEMA DARI FILE KITA SEBELUMNYA ---
// Pastikan path ini benar

// --- DEFINISI INTERFACE WARNA YANG DIBUTUHKAN ---
interface ThemeColors {
  text: string;
  background: string;
  cardPoint: string; // Warna khusus untuk card poin
  status: {
    success: string;
  };
  gradientSecondaryStart: string; // Untuk Colors.border.light
  gradientSecondaryEnd: string;   // Untuk Colors.border.dark
}

// --- FUNGSI STYLE SHEET BERTEMA ---
const getCardPointStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
       paddingHorizontal: 12,
       paddingVertical: 8,
       borderRadius: 8,
       marginVertical: 8,
       // Card Poin tidak menggunakan latar belakang transparan agar lebih menonjol
       backgroundColor: colors.cardPoint, 
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        boxSizing: 'border-box',
        // paddingLeft: 4,
        paddingRight: 8,
        // boxSizing tidak didukung di React Native StyleSheet
        // boxSizing: 'border-box', 
    },
    point: {
        fontSize: 14,
        fontWeight: 'bold',
        // Warna teks
        color: colors.text, 
    },
    lingkaran: {
        width: 10, 
        height: 10,
        borderRadius: 5, // Mengganti "50%" dengan nilai numerik
        // Warna lingkaran menggunakan warna Status Success
        backgroundColor: colors.status.success, 
    }
});

// --- KOMPONEN CARD POINT DENGAN GRADIENT BERTEMA ---
interface CardProps {
    point?: string;
}

export default function CardPoint({ point }: CardProps) {
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark']; 
    
    // Pastikan type assertion di sini jika diperlukan, atau perbaiki interface Colors
    const styles = getCardPointStyles(colorTheme as ThemeColors);

    return (
        <LinearGradient
            start={{ x: 0, y: 1.3 }}
            end={{ x: 1.3, y: 0 }}
            // MENGGUNAKAN GRADIENT SEKUNDER UNTUK BORDER/EFEK
            // Gradien ini biasanya lebih cerah atau memiliki kombinasi warna aksen (Biru-Emas)
            colors={[colorTheme.gradientTertiaryStart, colorTheme.gradientTertiaryEnd]}
            style={styles.card}
        >
            <View style={styles.content}>
                <View style={styles.lingkaran} />
                {point && <Text style={styles.point}>{point}</Text>}
            </View>
        </LinearGradient>
    );
}