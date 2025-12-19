import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface AppColors {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  icon: string;
  border?: string;
  success?: string;
  warning?: string;
  info?: string;
}

interface VariantStyles {
  header: ViewStyle;
  iconContainer: ViewStyle;
  variantLabel: ViewStyle;
}

export const getAccordionStyles = (colors: AppColors, variant?: string) => {
  
  // Gaya berdasarkan variant
  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'important':
        return {
          header: {
            borderLeftWidth: 4,
            borderLeftColor: colors.warning || '#FF6B6B',
          },
          iconContainer: {
            backgroundColor: colors.warning ? `${colors.warning}20` : '#FF6B6B20',
          },
          variantLabel: {
            backgroundColor: colors.warning ? `${colors.warning}20` : '#FF6B6B20',
          }
        };
      case 'tip':
        return {
          header: {
            borderLeftWidth: 4,
            borderLeftColor: colors.info || '#4ECDC4',
          },
          iconContainer: {
            backgroundColor: colors.info ? `${colors.info}20` : '#4ECDC420',
          },
          variantLabel: {
            backgroundColor: colors.info ? `${colors.info}20` : '#4ECDC420',
          }
        };
      case 'exercise':
        return {
          header: {
            borderLeftWidth: 4,
            borderLeftColor: colors.success || '#1DD1A1',
          },
          iconContainer: {
            backgroundColor: colors.success ? `${colors.success}20` : '#1DD1A120',
          },
          variantLabel: {
            backgroundColor: colors.success ? `${colors.success}20` : '#1DD1A120',
          }
        };
      case 'summary':
        return {
          header: {
            borderLeftWidth: 4,
            borderLeftColor: colors.tint,
          },
          iconContainer: {
            backgroundColor: `${colors.tint}20`,
          },
          variantLabel: {
            backgroundColor: `${colors.tint}20`,
          }
        };
      default:
        return {
          header: {},
          iconContainer: {},
          variantLabel: {}
        };
    }
  };

  const variantStyles = getVariantStyles();

  return StyleSheet.create({
    container: {
      marginVertical: 10,
      overflow: 'hidden',
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border || 'rgba(0,0,0,0.05)',
    } as ViewStyle,
    
    header: {
      ...variantStyles.header,
      backgroundColor: colors.cardBackground,
    } as ViewStyle,
    
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
    } as ViewStyle,
    
    titleContainer: {
      flex: 1,
      marginRight: 15,
    } as ViewStyle,
    
    iconLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    } as ViewStyle,
    
    variantLabel: {
      ...variantStyles.variantLabel,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    } as ViewStyle,
    
    variantLabelText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.tint,
    } as TextStyle,
    
    title: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 24,
      color: colors.text,
      marginBottom: 4,
    } as TextStyle,
    
    subtitle: {
      fontSize: 14,
      color: colors.icon,
      opacity: 0.8,
    } as TextStyle,
    
    iconContainer: {
      ...variantStyles.iconContainer,
      justifyContent: 'center',
      alignItems: 'center',
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border || 'rgba(0,0,0,0.1)',
    } as ViewStyle,
    
    progressContainer: {
      marginTop: -5,
      marginBottom: 15,
      marginHorizontal: 20,
    } as ViewStyle,
    
    progressBackground: {
      height: 6,
      backgroundColor: colors.border || 'rgba(0,0,0,0.1)',
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 6,
    } as ViewStyle,
    
    progressFill: {
      height: '100%',
      borderRadius: 3,
    } as ViewStyle,
    
    progressText: {
      fontSize: 12,
      color: colors.icon,
      textAlign: 'right',
    } as TextStyle,
    
    animatedContent: {
      overflow: 'hidden',
      backgroundColor: colors.background,
    } as ViewStyle,
    
    content: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      position: 'absolute',
      width: '100%',
      backgroundColor: colors.background,
    } as ViewStyle,
    
    contentDivider: {
      height: 1,
      backgroundColor: colors.border || 'rgba(0,0,0,0.1)',
      marginBottom: 20,
    } as ViewStyle,
  });
};