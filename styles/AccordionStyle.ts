import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface AppColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  icon: string;
}

export const getAccordionStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 12,
    // Latar belakang card/container, menggunakan cardBackground
    backgroundColor: colors.cardBackground, 
  } as ViewStyle,
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.cardBackground, 
  } as ViewStyle,
  
  title: {
    flex: 1,
    marginRight: 10,
    // Warna teks utama
    color: colors.text, 
  } as TextStyle,
  
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  } as ViewStyle,
  
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    // Warna ikon, menggunakan tint (Magic Blue atau Gold)
    color: colors.tint, 
  } as TextStyle,
  
  animatedContent: {
    overflow: 'hidden',
    // Gunakan background utama tema agar terlihat seamless dengan container luar jika ada
    backgroundColor: colors.background, 
  } as ViewStyle,
  
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.background, 
  } as ViewStyle,
});