import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    useColorScheme,
    View,
    ViewStyle
} from 'react-native';

interface CardListRangkumanProps {
    title: string;
    date?: string;
    itemCount?: number;
    soalCount?: number;
    fileSize?: number;
    onPress?: () => void;
    onDelete?: () => void;
    style?: ViewStyle;
    titleStyle?: TextStyle;
    showDeleteButton?: boolean;
    showStats?: boolean;
}

export default function CardListRangkuman({
    title,
    date,
    itemCount = 0,
    soalCount = 0,
    fileSize,
    onPress,
    onDelete,
    style,
    titleStyle,
    showDeleteButton = false,
    showStats = true
}: CardListRangkumanProps) {
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark'];

    // Menentukan skema warna teks di dalam card (selalu putih/terang karena gradien biasanya pekat)
    const cardTextColor = '#FFFFFF';
    const cardSubtextColor = 'rgba(255, 255, 255, 0.8)';

    const CardContent = () => (
        <View style={styles.content}>
            {/* Header dengan icon dan title */}
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                    <Ionicons name="document-text" size={20} color={cardTextColor} />
                </View>

                <View style={styles.titleContainer}>
                    <Text
                        style={[
                            styles.title,
                            { color: cardTextColor },
                            titleStyle
                        ]}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    {date && (
                        <Text style={[styles.dateText, { color: cardSubtextColor }]}>
                            {date}
                        </Text>
                    )}
                </View>
            </View>

            {/* Stats Section */}
            {showStats && (
                <View style={[styles.statsContainer, { borderTopColor: 'rgba(255, 255, 255, 0.15)' }]}>
                    <View style={styles.statsLeft}>
                        {itemCount > 0 && (
                            <View style={styles.statItem}>
                                <Ionicons name="book" size={12} color={cardSubtextColor} />
                                <Text style={[styles.statText, { color: cardSubtextColor }]}>
                                    {itemCount} Materi
                                </Text>
                            </View>
                        )}
                        {soalCount > 0 && (
                            <View style={styles.statItem}>
                                <Ionicons name="fitness" size={12} color={cardSubtextColor} />
                                <Text style={[styles.statText, { color: cardSubtextColor }]}>
                                    {soalCount} Soal
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Delete Button */}
            {showDeleteButton && onDelete && (
                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: 'rgba(255, 17, 17, 0.56)' }]}
                    onPress={onDelete}
                    activeOpacity={0.6}
                >
                    <Ionicons name="trash" size={16} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );

    const gradientColors = scheme === 'dark'
        ? [colorTheme.gradientPrimaryEnd, colorTheme.gradientPrimaryStart] as const
        : [colorTheme.gradientPrimaryStart, colorTheme.gradientPrimaryEnd] as const;

    const cardWrapper = (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={gradientColors} // Sekarang error TS2769 akan hilang
            style={[styles.container, style]}
        >
            <CardContent />
        </LinearGradient>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {cardWrapper}
            </TouchableOpacity>
        );
    }

    return cardWrapper;
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
        borderRadius: 20, // Lebih rounded sesuai tren UI modern
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    content: {
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingRight: 30, // Ruang untuk tombol delete
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    statsLeft: {
        flexDirection: 'row',
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    deleteButton: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});