import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
// Asumsi: Anda akan mengimpor Colors dari file tema yang sudah kita buat
// import { Colors } from 'constants/theme'; 

interface AppColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  icon: string;
  gradientPrimaryStart: string;
  gradientPrimaryEnd: string;
}

// Fungsi ini akan menerima objek warna (misalnya Colors.dark atau Colors.light)
export const getStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    gap: 30,
    padding: 10,
    justifyContent: 'center',
    // Gunakan background utama tema
    backgroundColor: colors.background, 
  } as ViewStyle,
  
  // Area untuk upload file (dashed border)
  areaFile: {
    flex: 1,
    // Gunakan warna tint/emas untuk border
    borderColor: colors.tint, 
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    borderRadius: 10,
    // Gunakan cardBackground atau warna transparan dari tint
    // Saya gunakan warna cardBackground dengan sedikit opasitas
    backgroundColor: `${colors.cardBackground}33`, // Opasitas 20%
  } as ViewStyle,
  
  // Tombol utama (Generate)
  buttonGenerate: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    // Diisi dengan warna tint utama (Magic Blue atau Gold)
    backgroundColor: colors.tint, 
  } as ViewStyle,
  
  // Tombol sekunder (Reupload)
  buttonReupload: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
    // Latar belakang Card atau background dengan border tint
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.background,
  } as ViewStyle,
  
  // Gaya teks umum
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    // Warna teks utama
    color: colors.text, 
    marginLeft: 8,
    
  } as TextStyle,
  
  // Info File (Card)
  fileInfoContainer: {
    padding: 15,
    // Latar belakang card
    backgroundColor: colors.cardBackground, 
    borderRadius: 8,
    marginBottom: 10,
  } as ViewStyle,
  
  fileInfoItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    // Warna teks utama
    color: colors.text, 
  } as TextStyle,
  
  // Label Info File (misalnya "Nama File:")
  fileInfoLabel: {
    fontWeight: '600',
    // Warna sekunder/aksen (Tint)
    color: colors.tint, 
  } as TextStyle,
  
  // Soal Card
  soalContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    // Latar belakang card
    backgroundColor: colors.cardBackground, 
    borderRadius: 8,
  } as ViewStyle,
  
  // Nomor Soal
  soalNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    // Warna Tint
    color: colors.tint, 
  } as TextStyle,
  
  soalContent: {
    flex: 1,
  } as ViewStyle,
  
  // Pertanyaan
  soalPertanyaan: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 22,
    // Warna teks utama
    color: colors.text, 
  } as TextStyle,
  
  pilihanContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  } as ViewStyle,
  
  // Huruf Pilihan (A, B, C...)
  pilihanHuruf: {
    fontWeight: '500',
    marginRight: 8,
    // Warna Gold (Aksen sekunder)
    color: colors.tint === '#D4AF37' ? colors.tint : '#D4AF37', // Jika tint bukan emas, gunakan emas
    minWidth: 20,
  } as TextStyle,
  
  // Teks Pilihan
  pilihanText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    // Warna teks utama
    color: colors.text, 
  } as TextStyle,
  
  // Jawaban yang Benar
  jawabanContainer: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    // Background hijau transparan diganti dengan background card transparan + border tint
    backgroundColor: `${colors.cardBackground}66`, 
    borderRadius: 6,
    borderLeftWidth: 3,
    // Border warna Tint (Magic Blue atau Gold)
    borderLeftColor: colors.tint, 
  } as ViewStyle,
  
  // Label Jawaban ("Jawaban:")
  jawabanLabel: {
    fontWeight: '600',
    // Warna Tint
    color: colors.tint, 
  } as TextStyle,
  
  // Teks Jawaban
  jawabanText: {
    fontWeight: '600',
    // Warna teks utama
    color: colors.text, 
  } as TextStyle,
  
  // Summary
  summaryContainer: {
    padding: 15,
    // Latar belakang Card
    backgroundColor: colors.cardBackground, 
    borderRadius: 8,
  } as ViewStyle,
  
  summaryItem: {
    fontSize: 14,
    marginBottom: 10,
    // Warna ikon/teks sekunder yang lebih lembut
    color: colors.icon, 
  } as TextStyle,
  // Di dalam fungsi getStyles, tambahkan:
buttonSave: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 12,
  marginHorizontal: 20,
  marginBottom: 10,
},
savedDataInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.icon,
  marginHorizontal: 20,
  marginTop: 10,
},
});