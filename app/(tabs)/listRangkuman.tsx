import CardListRangkuman from '@/components/result/card-list-rangkuman';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

const STORAGE_KEY = 'saved_api_data';

export default function ListRangkuman() {
    const [savedData, setSavedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark'];
    
    // Tambah hook useAuth
    const { statusLogin, isAuthenticated, isCheckingAuth, userData } = useAuth();

    const loadSavedData = useCallback(async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await SecureStore.getItemAsync(STORAGE_KEY);
            if (data) {
                const parsedData = JSON.parse(data);
                // Sort by savedAt (newest first)
                const sortedData = parsedData.sort((a: any, b: any) => 
                    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
                );
                setSavedData(sortedData);
            } else {
                setSavedData([]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Gagal memuat data rangkuman');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Versi 1: useFocusEffect sederhana
    useFocusEffect(
        useCallback(() => {
            console.log('ListRangkuman tab focused - refreshing data');
            
            // Hanya load data jika user sudah login
            if (isAuthenticated()) {
                loadSavedData();
            } else {
                setLoading(false);
            }
            
            // Cleanup function (optional)
            return () => {
                console.log('ListRangkuman tab unfocused');
            };
        }, [isAuthenticated, loadSavedData])
    );
    const onRefresh = useCallback(() => {
        if (isAuthenticated()) {
            loadSavedData(true);
        }
    }, [isAuthenticated, loadSavedData]);

    const deleteItem = (id: string) => {
        Alert.alert(
            'Hapus Data',
            'Yakin ingin menghapus rangkuman ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedData = savedData.filter(item => item.id !== id);
                            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedData));
                            setSavedData(updatedData);
                            Alert.alert('Sukses', 'Rangkuman berhasil dihapus');
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Gagal menghapus rangkuman');
                        }
                    }
                }
            ]
        );
    };

    const navigateToDetail = (item: any) => {
        router.push({
            pathname: '/detailRangkuman',
            params: { 
                data: JSON.stringify(item),
                id: item.id 
            }
        });
    };

    const navigateToLogin = () => {
        router.push('/(tabs)/profile');
    };

    const navigateToHome = () => {
        router.push('/(tabs)');
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        // Decode nama file dari URL encoding
        const fileName = decodeURIComponent(item.fileInfo?.originalName || `Rangkuman ${index + 1}`);
        
        // Format tanggal dengan error handling
        let formattedDate = "invalid Date";
        try {
            const date = new Date(item.savedAt);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
        }

        return (
            <ThemedView key={item.id} style={styles.cardContainer}>
                <CardListRangkuman 
                    title={fileName}
                    date={formattedDate}
                    itemCount={item.data?.materi?.length || 0}
                    soalCount={item.data?.materi?.reduce((acc: number, curr: any) => 
                        acc + (curr.soalLatihan?.length || 0), 0)}
                    fileSize={item.fileInfo?.size}
                    onPress={() => navigateToDetail(item)}
                    onDelete={() => deleteItem(item.id)}
                    showDeleteButton={true}
                />
            </ThemedView>
        );
    };

    // Tampilkan loading saat check auth status
    if (isCheckingAuth()) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4A6FA5" />
                    <Text style={styles.loadingText}>Memeriksa status login...</Text>
                </View>
            </ThemedView>
        );
    }

    // Jika user belum login
    if (!isAuthenticated()) {
        return (
            <ThemedView style={styles.container}>
                {/* Header tetap sama */}
                <ThemedView style={styles.header}>
                    <ThemedView style={styles.headerContent}>
                        <ThemedText style={styles.title}>Rangkuman Tersimpan</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Login untuk melihat rangkuman
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Konten untuk user belum login */}
                <View style={styles.loginRequiredContainer}>
                    <Ionicons name="lock-closed-outline" size={80} color={colorTheme.icon} />
                    <ThemedText style={styles.loginTitle}>Login Diperlukan</ThemedText>
                    <ThemedText style={styles.loginMessage}>
                        Anda perlu login untuk melihat rangkuman yang tersimpan
                    </ThemedText>
                    
                    <TouchableOpacity 
                        style={[styles.loginButton, {backgroundColor: colorTheme.tint}]}
                        onPress={navigateToLogin}
                    >
                        <Ionicons name="log-in-outline" size={20} color="white" />
                        <Text style={styles.loginButtonText}>Login Sekarang</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={navigateToHome}
                    >
                        <Ionicons name="add-circle-outline" size={20} color={colorTheme.tint} />
                        <Text style={[styles.createButtonText, {color: colorTheme.tint}]}>
                            Buat Rangkuman Baru
                        </Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    // Jika user sudah login, tampilkan konten biasa
    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <ThemedView style={styles.header}>
                <ThemedView style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerTextContainer}>
                            <ThemedText style={styles.title}>Rangkuman Tersimpan</ThemedText>
                            <ThemedText style={styles.subtitle}>
                                {savedData.length} rangkuman
                            </ThemedText>
                        </View>
                        <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={() => loadSavedData(true)}
                            disabled={refreshing}
                        >
                            {refreshing && (
                                <ActivityIndicator size="small" color={colorTheme.tint} />
                            )}
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ThemedView>

            {/* Content */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4A6FA5" />
                    <Text style={styles.loadingText}>Memuat data...</Text>
                </View>
            ) : savedData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={80} color={colorTheme.icon} />
                    <ThemedText style={styles.emptyText}>Belum ada rangkuman</ThemedText>
                    <ThemedText style={styles.emptySubtext}>
                        Upload PDF untuk membuat rangkuman pertama Anda
                    </ThemedText>
                    <TouchableOpacity 
                        style={[styles.createButton, {marginTop: 20}]}
                        onPress={navigateToHome}
                    >
                        <Ionicons name="add-circle-outline" size={20} color={colorTheme.tint} />
                        <Text style={[styles.createButtonText, {color: colorTheme.tint}]}>
                            Buat Rangkuman Baru
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={savedData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colorTheme.tint]}
                            tintColor={colorTheme.tint}
                            title="Menyegarkan..."
                            titleColor={colorTheme.tint}
                        />
                    }
                    // ListHeaderComponent={
                    //     <View style={styles.refreshHint}>
                    //         <Ionicons name="arrow-down-outline" size={16} color={colorTheme.tint} />
                    //         <Text style={[styles.refreshHintText, {color: colorTheme.text}]}>
                    //             Tarik ke bawah untuk menyegarkan
                    //         </Text>
                    //     </View>
                    // }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={80} color={colorTheme.icon} />
                            <ThemedText style={styles.emptyText}>Belum ada rangkuman</ThemedText>
                            <ThemedText style={styles.emptySubtext}>
                                Upload PDF untuk membuat rangkuman pertama Anda
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    refreshButton: {
        padding: 8,
        marginLeft: 10,
    },
    cardContainer: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    listContainer: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        color: '#94A3B8',
        lineHeight: 20,
    },
    // Styles untuk login required
    loginRequiredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 20,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
    },
    loginMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#64748B',
        lineHeight: 24,
        marginBottom: 10,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        gap: 10,
        marginTop: 10,
        width: '100%',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: '#4A6FA5',
    },
    createButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    refreshHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        marginBottom: 10,
    },
    refreshHintText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});