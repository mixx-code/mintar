import { Colors, Fonts } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

interface CardPointProps {
    point?: string;
    index?: number;
}

const getCardPointStyles = (colors: any) => StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    card: {
      backgroundColor: colors.cardPoint,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: colors.tint + '20',
    },
    numberContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.tint,
        justifyContent: 'center',
      alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    numberText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: Fonts.sans,
    },
    pointText: {
        fontSize: 14,
      fontFamily: Fonts.sans,
      color: colors.text,
      flex: 1,
      lineHeight: 20,
    },
    checkIcon: {
        marginLeft: 8,
        marginTop: 2,
    },
});

export default function CardPoint({ point, index }: CardPointProps) {
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark'];
    const styles = getCardPointStyles(colorTheme);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {index !== undefined && (
                    <View style={styles.numberContainer}>
                        <Text style={styles.numberText}>{index}</Text>
                    </View>
                )}

              <Text style={styles.pointText}>
                  {point}
              </Text>

              <Feather
                  name="check-circle"
                  size={18}
                  color={colorTheme.tint}
                  style={styles.checkIcon}
              />
          </View>
      </View>
  );
}