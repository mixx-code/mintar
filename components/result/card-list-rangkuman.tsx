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
    const CardContent = () => (
        <View style={[styles.content, style]}>
            {/* Header dengan icon dan title */}
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colorTheme.background + '80' }]}>
                    <Ionicons name="document-text-outline" size={22} color={colorTheme.icon} />
                </View>

                    <Text
                        style={[
                            styles.title,
                            { color: colorTheme.text },
                            titleStyle
                        ]}
                        numberOfLines={2}
                    >
                        {title}
                    </Text>
                {/* <View style={styles.titleContainer}>
                </View> */}
            </View>

            {/* Stats Section */}
            {showStats && (itemCount > 0 || soalCount > 0) && (
                <View style={styles.statsContainer}>
                    {itemCount > 0 && (
                        <View style={styles.statItem}>
                            <Ionicons name="book-outline" size={14} color={colorTheme.icon} />
                            <Text style={[styles.statText, { color: colorTheme.text }]}>
                                {itemCount} materi
                            </Text>
                        </View>
                    )}

                    {soalCount > 0 && (
                        <View style={styles.statItem}>
                            <Ionicons name="help-circle-outline" size={14} color={colorTheme.icon} />
                            <Text style={[styles.statText, { color: colorTheme.text }]}>
                                {soalCount} soal
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Delete Button */}
            {showDeleteButton && onDelete && (
                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: colorTheme.icon + '20' }]}
                    onPress={onDelete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={18} color='red' />
                </TouchableOpacity>
            )}
        </View>
    );

    // Wrapper dengan atau tanpa TouchableOpacity
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1.3, y: 0 }}
                    colors={[colorTheme.gradientTertiaryEnd, colorTheme.gradientSecondaryStart]}
                    style={[styles.container, style]}
                >
                    <CardContent />
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1.3, y: 0 }}
            colors={[colorTheme.gradientTertiaryEnd, colorTheme.gradientSecondaryStart]}
            style={[styles.container, style]}
        >
            <CardContent />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 20,
        marginBottom: 6,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontFamily: 'System',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.08)',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
        fontWeight: '500',
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 6,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
});