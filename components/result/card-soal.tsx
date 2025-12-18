// components/result/card-soal.tsx
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme
} from 'react-native';

export interface SoalLatihan {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  jawaban: string;
}

interface CardSoalProps {
  soal: SoalLatihan;
  nomor: number;
  showJawaban?: boolean; // default state jika ingin jawaban awal hidden
}

interface ThemeColors {
  text: string;
  cardSoal: string;
  tint: string;
  icon: string;
  status: {
    success: string;
    warning: string;
  };
  border?: string;
}

// --- FUNGSI STYLE SHEET BERTEMA ---
const getCardSoalStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.cardSoal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border ?? `${colors.tint}33`,
  } as ViewStyle,
  
  nomor: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
    color: colors.tint,
    minWidth: 24,
  } as TextStyle,
  
  content: {
    flex: 1,
  } as ViewStyle,
  
  pertanyaan: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 22,
    color: colors.text,
  } as TextStyle,
  
  pilihanContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  } as ViewStyle,
  
  pilihanHuruf: {
    fontWeight: '500',
    marginRight: 10,
    color: colors.status.warning,
    minWidth: 24,
    fontSize: 14,
  } as TextStyle,
  
  pilihanText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.icon,
  } as TextStyle,
  
  // Container tombol toggle
  toggleButtonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  } as ViewStyle,
  
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${colors.tint}15`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.tint}30`,
  } as ViewStyle,
  
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
    color: colors.tint,
  } as TextStyle,
  
  // Container Jawaban (akan muncul ketika di-toggle)
  jawabanContainer: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    backgroundColor: `${colors.cardSoal}55`,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.success,
    alignItems: 'center',
    flexWrap: 'wrap',
  } as ViewStyle,
  
  jawabanLabel: {
    fontWeight: '600',
    color: colors.status.success,
    fontSize: 14,
  } as TextStyle,
  
  jawabanText: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 14,
    marginHorizontal: 4,
  } as TextStyle,
  
  jawabanDetail: {
    fontSize: 13,
    color: `${colors.status.success}cc`,
    fontStyle: 'italic',
  } as TextStyle,
  
  // Style untuk highlight jawaban yang benar di pilihan
  pilihanContainerCorrect: {
    backgroundColor: `${colors.status.success}15`,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  } as ViewStyle,
  
  pilihanTextCorrect: {
    fontWeight: '600',
    color: colors.status.success,
  } as TextStyle,
});

export default function CardSoal({ soal, nomor, showJawaban = false }: CardSoalProps) {
  const scheme = useColorScheme();
  const colorTheme = Colors[scheme ?? 'dark'] as ThemeColors;
  
  // State untuk toggle tampil/sembunyi jawaban
  const [isJawabanVisible, setIsJawabanVisible] = useState(showJawaban);
  
  const styles = getCardSoalStyles(colorTheme);
  
  // Fungsi untuk toggle visibility
  const toggleJawaban = () => {
    setIsJawabanVisible(!isJawabanVisible);
  };
  
  // Fungsi untuk mendapatkan indeks jawaban (0 untuk A, 1 untuk B, dst)
  const getJawabanIndex = () => {
    const jawabanHuruf = soal.jawaban.toUpperCase();
    return jawabanHuruf.charCodeAt(0) - 65; // 'A' = 65 dalam ASCII
  };
  
  const jawabanIndex = getJawabanIndex();
  
  return (
    <View style={styles.container}>
      <Text style={styles.nomor}>{nomor}.</Text>
      <View style={styles.content}>
        <Text style={styles.pertanyaan}>
          {soal.pertanyaan}
        </Text>

        {/* Pilihan Jawaban */}
        {soal.pilihan?.map((pilihan, idx) => {
          const isCorrectAnswer = idx === jawabanIndex;
          
          return (
            <View 
              key={idx} 
              style={[
                styles.pilihanContainer,
                isJawabanVisible && isCorrectAnswer && styles.pilihanContainerCorrect
              ]}
            >
              <Text style={[
                styles.pilihanHuruf,
                isJawabanVisible && isCorrectAnswer && styles.pilihanTextCorrect
              ]}>
                {String.fromCharCode(65 + idx)}.
              </Text>
              <Text style={[
                styles.pilihanText,
                isJawabanVisible && isCorrectAnswer && styles.pilihanTextCorrect
              ]}>
                {pilihan}
              </Text>
            </View>
          );
          
        })}
        {/* Tombol Toggle Jawaban */}
        <View style={styles.toggleButtonContainer}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleJawaban}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isJawabanVisible ? "eye-off-outline" : "eye-outline"} 
              size={16} 
              color={colorTheme.tint} 
            />
            <Text style={styles.toggleButtonText}>
              {isJawabanVisible ? "Sembunyikan Jawaban" : "Tampilkan Jawaban"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Jawaban (hanya tampil jika isJawabanVisible = true) */}
        {isJawabanVisible && (
          <View style={styles.jawabanContainer}>
            <Text style={styles.jawabanLabel}>Jawaban: </Text>
            <Text style={styles.jawabanText}>
              {soal.jawaban}
            </Text>
            {/* <Text style={styles.jawabanDetail}>
              {` (${soal.pilihan[jawabanIndex]})`}
            </Text> */}
          </View>
        )}
        
      </View>
    </View>
  );
};