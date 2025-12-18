import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Asumsi: Anda akan mengimpor Colors yang memiliki properti yang kita definisikan
interface AppColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string; // Magic Blue atau Gold
}

/**
 * Mengembalikan objek StyleSheet untuk komponen Card Rangkuman
 * yang menggunakan warna dari tema yang aktif.
 * @param colors Objek warna tema aktif (mis. Colors.dark atau Colors.light).
 */
export const getSummaryCardStyles = (colors: AppColors) => StyleSheet.create({
    // Gaya Card Utama
    card: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        borderWidth: 1,
        // Warna border: Gunakan warna aksen/tint
        borderColor: colors.tint, 
        // Latar belakang card: Gunakan cardBackground
        backgroundColor: colors.cardBackground,
    } as ViewStyle,
    
    content: {
        paddingHorizontal: 4,
    } as ViewStyle,
    
    // Gaya Judul Rangkuman
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        // Warna teks judul: Gunakan warna teks utama
        color: colors.text, 
        textDecorationLine: 'underline',
        // Opsional: Jika ingin judul menggunakan warna aksen (Tint)
        // color: colors.tint,
    } as TextStyle,
    
    // Gaya Deskripsi/Isi Rangkuman
    description: {
        fontSize: 15,
        // Warna teks deskripsi: Gunakan warna teks utama
        color: colors.text, 
        textAlign: 'justify',
        lineHeight: 25,
    } as TextStyle,
});