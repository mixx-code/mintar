import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

// --- ASUMSI IMPORT WARNA TEMA DARI FILE KITA SEBELUMNYA ---
// Ganti path sesuai struktur proyek Anda


// --- DEFINISI INTERFACE WARNA YANG DIBUTUHKAN ---
interface ThemeColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  gradientPrimaryStart: string;
  gradientPrimaryEnd: string;
}

// --- FUNGSI STYLE SHEET BERTEMA ---
const getSummaryCardStyles = (colors: ThemeColors) => StyleSheet.create({
    card: {
       padding: 12,
       borderRadius: 8,
       marginVertical: 8,
       borderWidth: 1,
       // Boundary/Border menggunakan warna aksen (Tint)
       borderColor: colors.tint, 
    },
    content: {
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        // Warna teks judul menggunakan teks utama
        color: colors.text, 
        textDecorationLine: 'underline',
    },
    description: {
        fontSize: 15,
        // Warna teks deskripsi menggunakan teks utama
        color: colors.text, 
        lineHeight: 20,
    },
});

// --- KOMPONEN CARD RANGKUMAN DENGAN GRADIENT BERTEMA ---
interface CardProps {
    title?: string;
    description?: string;
}

export default function CardRangkuman({ title, description }: CardProps) {
    const scheme = useColorScheme();
    // Pilih tema warna yang aktif
    const colorTheme = Colors[scheme ?? 'dark']; 
    
    // Panggil fungsi style sheet dengan tema aktif
    const styles = getSummaryCardStyles(colorTheme as ThemeColors);

    return (
        <LinearGradient
            start={{ x: 0, y: 1.3 }}
            end={{ x: 1.3, y: 0 }}
            // MENGGUNAKAN PROPERTI GRADIENT DARI TEMA
            // Di mode gelap: Gradien dari Biru Pekat ke Biru Pekat Medium
            // Di mode terang: Gradien dari Magic Blue ke Biru Lebih Muda
            colors={[colorTheme.gradientPrimaryStart, colorTheme.gradientPrimaryEnd]}
            style={styles.card}
        >
            <View style={styles.content}>
                {/* {title && <Text style={styles.title}>{title}</Text>} */}
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
        </LinearGradient>
    );
}