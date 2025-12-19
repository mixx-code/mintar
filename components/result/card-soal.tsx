import { Colors, Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  showJawaban?: boolean;
}

const getCardSoalStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardSoal,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.tint + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nomorContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nomorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Fonts.sans,
  },
  pertanyaan: {
    fontSize: 15,
    fontFamily: Fonts.sans,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  pilihanContainer: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.tint + '15',
  },
  pilihanContainerCorrect: {
    backgroundColor: colors.status.success + '15',
    borderColor: colors.status.success + '40',
  },
  pilihanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pilihanHuruf: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.tint,
    width: 20,
    marginRight: 10,
    fontFamily: Fonts.sans,
  },
  pilihanHurufCorrect: {
    color: colors.status.success,
  },
  pilihanText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: colors.text,
    opacity: 0.9,
    flex: 1,
    lineHeight: 20,
  },
  pilihanTextCorrect: {
    color: colors.status.success,
    opacity: 1,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.tint + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tint + '30',
    alignSelf: 'flex-start',
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.tint,
    marginLeft: 8,
    fontFamily: Fonts.sans,
  },
  jawabanContainer: {
    marginTop: 12,
    padding: 14,
    backgroundColor: colors.status.success + '10',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.success,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  jawabanLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.status.success,
    fontFamily: Fonts.sans,
  },
  jawabanText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.status.success,
    marginLeft: 6,
    fontFamily: Fonts.sans,
  },
});

export default function CardSoal({ soal, nomor, showJawaban = false }: CardSoalProps) {
  const scheme = useColorScheme();
  const colorTheme = Colors[scheme ?? 'dark'];
  const [isJawabanVisible, setIsJawabanVisible] = useState(showJawaban);
  
  const styles = getCardSoalStyles(colorTheme);

  const toggleJawaban = () => {
    setIsJawabanVisible(!isJawabanVisible);
  };

  const getJawabanIndex = () => {
    const jawabanHuruf = soal.jawaban.toUpperCase();
    return jawabanHuruf.charCodeAt(0) - 65;
  };
  
  const jawabanIndex = getJawabanIndex();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nomorContainer}>
          <Text style={styles.nomorText}>{nomor}</Text>
        </View>

        <Text style={styles.pertanyaan}>
          {soal.pertanyaan}
        </Text>
      </View>

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
            <View style={styles.pilihanContent}>
              <Text style={[
                styles.pilihanHuruf,
                isJawabanVisible && isCorrectAnswer && styles.pilihanHurufCorrect
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
          </View>
        );
      })}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleJawaban}
          activeOpacity={0.7}
        >
          <Feather
            name={isJawabanVisible ? "eye-off" : "eye"}
            size={16}
            color={colorTheme.tint}
          />
          <Text style={styles.toggleButtonText}>
            {isJawabanVisible ? "Sembunyikan Jawaban" : "Lihat Jawaban"}
          </Text>
        </TouchableOpacity>

        {isJawabanVisible && (
          <View style={styles.jawabanContainer}>
            <Text style={styles.jawabanLabel}>Jawaban:</Text>
            <Text style={styles.jawabanText}>{soal.jawaban}</Text>
          </View>
        )}
      </View>
    </View>
  );
};