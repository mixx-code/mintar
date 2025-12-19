import { Dimensions, PixelRatio, StyleSheet, TextStyle, ViewStyle } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Standar lebar layar desain (iPhone 11/13/14)
const designWidth = 375;

// Fungsi helper untuk skala font
const scale = (size: number) => {
  const newSize = size * (SCREEN_WIDTH / designWidth);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface AppColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  icon: string;
  gradientPrimaryStart: string;
  gradientPrimaryEnd: string;
}

export const getStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    gap: scale(20),
    padding: scale(16),
    paddingTop: scale(40),
    backgroundColor: colors.background,
    justifyContent: 'center',
  } as ViewStyle,

  areaFile: {
    flex: 1,
    borderColor: colors.tint,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: scale(180),
    borderRadius: scale(20),
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
  } as ViewStyle,

  buttonGenerate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(54),
    borderRadius: scale(15),
  } as ViewStyle,

  buttonReupload: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(54),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,

  text: {
    backgroundColor: 'transparent',
    fontSize: scale(15),
    color: colors.text,
    marginLeft: scale(8),
    flexShrink: 1, // Agar teks menyusut jika tidak cukup ruang
    flexWrap: 'wrap', // Memungkinkan teks untuk wrap ke baris berikutnya
    // flex: 1, // Menggunakan sisa ruang yang tersedia
  } as TextStyle,
  textPdf: {
    backgroundColor: 'transparent',
    fontSize: scale(15),
    color: colors.text,
    marginLeft: scale(8),
    flexShrink: 1, // Agar teks menyusut jika tidak cukup ruang
    flexWrap: 'wrap', // Memungkinkan teks untuk wrap ke baris berikutnya
    flex: 1, // Menggunakan sisa ruang yang tersedia
  } as TextStyle,

  fileInfoContainer: {
    padding: scale(15),
    backgroundColor: colors.cardBackground,
    borderRadius: scale(8),
    marginBottom: scale(10),
  } as ViewStyle,

  fileInfoItem: {
    fontSize: scale(14),
    marginBottom: scale(8),
    lineHeight: scale(20),
    color: colors.text,
  } as TextStyle,

  fileInfoLabel: {
    fontSize: scale(14),
    fontWeight: '600',
    color: colors.tint,
  } as TextStyle,

  soalContainer: {
    flexDirection: 'row',
    marginBottom: scale(20),
    padding: scale(15),
    backgroundColor: colors.cardBackground,
    borderRadius: scale(12), // Sedikit lebih rounded agar modern
  } as ViewStyle,

  soalNumber: {
    fontSize: scale(16),
    fontWeight: '700',
    marginRight: scale(10),
    color: colors.tint,
  } as TextStyle,

  soalPertanyaan: {
    fontSize: scale(15),
    fontWeight: '600',
    marginBottom: scale(12),
    lineHeight: scale(22),
    color: colors.text,
  } as TextStyle,

  pilihanHuruf: {
    fontSize: scale(14),
    fontWeight: '700',
    marginRight: scale(8),
    color: colors.tint === '#D4AF37' ? colors.tint : '#D4AF37',
    minWidth: scale(20),
  } as TextStyle,

  pilihanText: {
    flex: 1,
    fontSize: scale(14),
    lineHeight: scale(20),
    color: colors.text,
  } as TextStyle,

  jawabanContainer: {
    flexDirection: 'row',
    marginTop: scale(10),
    padding: scale(10),
    backgroundColor: `${colors.cardBackground}66`,
    borderRadius: scale(8),
    borderLeftWidth: 4,
    borderLeftColor: colors.tint,
  } as ViewStyle,

  jawabanLabel: {
    fontSize: scale(14),
    fontWeight: '700',
    color: colors.tint,
  } as TextStyle,

  jawabanText: {
    fontSize: scale(14),
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,

  summaryItem: {
    fontSize: scale(14),
    marginBottom: scale(10),
    color: colors.icon,
  } as TextStyle,

  buttonSave: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  savedDataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(12),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: scale(10),
  },

  sectionHeader: {
    fontSize: scale(20),
    color: colors.text,
    fontWeight: '800',
    marginTop: scale(20),
    marginBottom: scale(10),
    letterSpacing: -0.5,
  } as TextStyle,
});