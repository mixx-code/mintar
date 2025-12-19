import { Colors, Fonts } from '@/constants/theme';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  useColorScheme
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardRangkumanProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'important';
  tags?: string[];
}

const getSummaryCardStyles = (colors: any) => StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.tint,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tint + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: colors.text,
    opacity: 0.9,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.tint + '15',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.tint,
  },
});

export default function CardRangkuman({ 
  title, 
  description,
  variant = 'default',
  tags = []
}: CardRangkumanProps) {
  const scheme = useColorScheme();
  const colorTheme = Colors[scheme ?? 'dark'];
  const styles = getSummaryCardStyles(colorTheme);

  // Pilih icon berdasarkan variant
  const getIcon = () => {
    switch (variant) {
      case 'important':
        return 'alert-circle';
      default:
        return 'book-open';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather 
              name={getIcon()} 
              size={18} 
              color={colorTheme.tint} 
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title || "Rangkuman Materi"}
          </Text>
        </View>
        
        {description && (
          <Text style={styles.description}>
            {description}
          </Text>
        )}
        
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}