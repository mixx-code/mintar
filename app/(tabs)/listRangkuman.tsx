import CardListRangkuman from '@/components/result/card-list-rangkuman';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Tambahkan ini
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
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

    const { isAuthenticated, isCheckingAuth } = useAuth();

    const loadSavedData = useCallback(async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) setRefreshing(true);
            else setLoading(true);

            console.log('🔍 Loading data from SecureStore...');

            const data = await SecureStore.getItemAsync(STORAGE_KEY);

            if (!data) {
                console.log('📭 No data found in storage');
                setSavedData([]);
                return;
            }

            console.log('📥 Raw data retrieved, length:', data.length);

            try {
                const parsedData = JSON.parse(data);

                // Validasi bahwa data adalah array
                if (!Array.isArray(parsedData)) {
                    console.error('❌ Data is not an array:', typeof parsedData);
                    // Jika data rusak, hapus dari storage
                    await SecureStore.deleteItemAsync(STORAGE_KEY);
                    setSavedData([]);
                    return;
                }

                console.log(`📊 Parsed ${parsedData.length} items`);

                // Filter hanya data yang valid
                const validData = parsedData.filter(item =>
                    item &&
                    typeof item === 'object' &&
                    item.id &&
                    item.savedAt
                );

                if (validData.length !== parsedData.length) {
                    console.warn(`⚠️ Filtered out ${parsedData.length - validData.length} invalid items`);
                }

                // Sort by date (newest first)
                const sortedData = validData.sort((a: any, b: any) =>
                    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
                );

                console.log('✅ Loaded data:', sortedData.map(item => ({
                    id: item.id,
                    name: decodeURIComponent(item.fileInfo?.originalName || 'Unknown'),
                    date: item.savedAt
                })));

                setSavedData(sortedData);

            } catch (parseError) {
                console.error('❌ Error parsing JSON:', parseError);
                // Jika data corrupt, hapus dari storage
                await SecureStore.deleteItemAsync(STORAGE_KEY);
                setSavedData([]);
                Alert.alert('Error', 'Data tidak valid, telah direset');
            }

        } catch (error) {
            console.error('❌ Error loading data:', error);
            Alert.alert('Error', 'Gagal memuat data rangkuman');
        } finally {
            setLoading(false);
            setRefreshing(false);
            console.log('🏁 Finished loading data');
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated()) loadSavedData();
            else setLoading(false);
        }, [isAuthenticated, loadSavedData])
    );

    const onRefresh = useCallback(() => {
        if (isAuthenticated()) loadSavedData(true);
    }, [isAuthenticated, loadSavedData]);

    const deleteItem = (id: string) => {
        console.log('Attempting to delete item with id:', id); // Debug log
        console.log('Current savedData IDs:', savedData.map(item => item.id)); // Debug log

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
                            console.log('Starting delete process for id:', id);

                            // 1. Ambil data langsung dari SecureStore untuk memastikan data terbaru
                            const savedDataFromStorage = await SecureStore.getItemAsync(STORAGE_KEY);
                            console.log('Raw data from storage:', savedDataFromStorage ? 'exists' : 'null');

                            if (!savedDataFromStorage) {
                                console.log('No data found in storage');
                                setSavedData([]);
                                return;
                            }

                            let parsedData: any[] = [];

                            // 2. Parse dengan error handling
                            try {
                                parsedData = JSON.parse(savedDataFromStorage);
                                if (!Array.isArray(parsedData)) {
                                    console.warn('Parsed data is not an array:', parsedData);
                                    parsedData = [];
                                }
                            } catch (parseError) {
                                console.error('Error parsing data:', parseError);
                                parsedData = [];
                            }

                            console.log('Parsed data length:', parsedData.length);
                            console.log('Parsed data IDs:', parsedData.map(item => item?.id));

                            // 3. Filter data - perbaikan: gunakan strict comparison
                            const originalLength = parsedData.length;
                            const updatedData = parsedData.filter(item => {
                                if (!item || typeof item !== 'object' || !item.id) {
                                    return true; // Keep invalid items to avoid data loss
                                }
                                return item.id.toString() !== id.toString(); // Convert to string for comparison
                            });

                            console.log('Updated data length:', updatedData.length);
                            console.log('Items removed:', originalLength - updatedData.length);

                            // 4. Cek apakah ada perubahan
                            if (updatedData.length === originalLength) {
                                console.log('No item found with id:', id);
                                console.log('Available IDs:', parsedData.map(item => item?.id));

                                // Tetap update state lokal untuk sinkronisasi
                                setSavedData(prev => {
                                    const newData = prev.filter(item => item.id !== id);
                                    console.log('Local state updated to length:', newData.length);
                                    return newData;
                                });
                                return;
                            }

                            // 5. Simpan ke SecureStore
                            console.log('Saving updated data to storage');
                            if (updatedData.length > 0) {
                                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedData));
                                console.log('Data saved to storage successfully');
                            } else {
                                // Hapus key jika array kosong
                                await SecureStore.deleteItemAsync(STORAGE_KEY);
                                console.log('Storage key deleted');
                            }

                            // 6. Update state lokal dengan data dari storage (bukan dari filter state)
                            console.log('Updating local state with filtered data');
                            setSavedData(updatedData);

                            // 7. Tambahkan log untuk verifikasi
                            setTimeout(async () => {
                                const verifyData = await SecureStore.getItemAsync(STORAGE_KEY);
                                console.log('Verification - Data in storage after delete:',
                                    verifyData ? JSON.parse(verifyData).length : 0, 'items');
                            }, 100);

                        } catch (error) {
                            console.error('Error deleting rangkuman:', error);
                            Alert.alert('Error', 'Gagal menghapus rangkuman');

                            // Fallback: update state lokal meskipun storage error
                            setSavedData(prev => {
                                const newData = prev.filter(item => item.id !== id);
                                console.log('Fallback - Local state updated to:', newData.length, 'items');
                                return newData;
                            });
                        }
                    }
                }
            ]
        );
    };

    const navigateToDetail = (item: any) => {
        router.push({
            pathname: '/detailRangkuman',
            params: { data: JSON.stringify(item), id: item.id }
        });
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const fileName = decodeURIComponent(item.fileInfo?.originalName || `Rangkuman ${index + 1}`);
        let formattedDate = "Baru saja";
        try {
            const date = new Date(item.savedAt);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });
            }
        } catch (e) { }

        return (
            <View key={item.id} style={styles.cardWrapper}>
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
            </View>
        );
    };

    if (isCheckingAuth()) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colorTheme.tint} />
                </View>
            </ThemedView>
        );
    }

    if (!isAuthenticated()) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.loginRequiredContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed" size={40} color={colorTheme.tint} />
                    </View>
                    <ThemedText style={styles.loginTitle}>Akses Terbatas</ThemedText>
                    <ThemedText style={styles.loginMessage}>
                        Masuk untuk menyimpan dan melihat riwayat rangkuman belajar Anda.
                    </ThemedText>

                    <TouchableOpacity style={styles.buttonWidth} onPress={() => router.push('/(tabs)/profile')}>
                        <LinearGradient
                            colors={[colorTheme.gradientPrimaryStart, colorTheme.gradientPrimaryEnd] as const}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Masuk Sekarang</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Koleksi</ThemedText>
                <ThemedText style={styles.subtitle}>{savedData.length} Rangkuman Tersimpan</ThemedText>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colorTheme.tint} />
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
                            tintColor={colorTheme.tint}
                            colors={[colorTheme.tint]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="document-text-outline" size={64} color={colorTheme.icon} style={{ opacity: 0.3 }} />
                            <ThemedText style={styles.emptyText}>Belum Ada Data</ThemedText>
                            <TouchableOpacity
                                style={[styles.createButton, { borderColor: colorTheme.tint }]}
                                onPress={() => router.push('/(tabs)')}
                            >
                                <ThemedText style={{ color: colorTheme.tint, fontWeight: '700' }}>Mulai Merangkum</ThemedText>
                            </TouchableOpacity>
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
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        opacity: 0.5,
        marginTop: 4,
    },
    listContainer: {
        paddingTop: 10,
        paddingBottom: 100,
    },
    cardWrapper: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 24,
        opacity: 0.6,
    },
    createButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    loginRequiredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
    },
    loginMessage: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.6,
        lineHeight: 24,
        marginBottom: 32,
    },
    buttonWidth: {
        width: '100%',
    },
    loginButton: {
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
    },
});