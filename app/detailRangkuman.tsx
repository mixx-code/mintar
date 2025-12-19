import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

import AccordionSection from '@/components/AccordionSection';
import CardPoint from '@/components/result/card-point';
import CardRangkuman from '@/components/result/card-rangkuman';
import CardSoal from '@/components/result/card-soal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

const STORAGE_KEY = 'saved_api_data';

interface ApiResponse {
    id: string;
    savedAt: string;
    fileInfo: {
        originalName: string;
        size: number;
        uploadedAt: string;
    };
    data: {
        materi: {
            tema: string;
            rangkuman: string;
            poinPenting: string[];
            soalLatihan: {
                id: string;
                pertanyaan: string;
                pilihan: string[];
                jawaban: string;
            }[];
        }[];
    };
}

export default function DetailRangkumanScreen() {
    const { data, id } = useLocalSearchParams<{ data: string; id: string }>();
    const router = useRouter();
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark'];

    const [rangkuman, setRangkuman] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setRangkuman(parsedData);
            } catch (error) {
                console.error('Error parsing data:', error);
                Alert.alert('Error', 'Gagal memuat data rangkuman');
                router.back();
            } finally {
                setLoading(false);
            }
        } else if (id) {
            loadFromStorage();
        }
    }, [data, id]);

    const loadFromStorage = async () => {
        try {
            const savedData = await SecureStore.getItemAsync(STORAGE_KEY);
            if (savedData) {
                const parsedData: ApiResponse[] = JSON.parse(savedData);
                const foundItem = parsedData.find(item => item.id === id);
                if (foundItem) {
                    setRangkuman(foundItem);
                } else {
                    Alert.alert('Error', 'Rangkuman tidak ditemukan');
                    router.back();
                }
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
            Alert.alert('Error', 'Gagal memuat data');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const deleteRangkuman = () => {
        Alert.alert(
            'Hapus Rangkuman',
            `Yakin ingin menghapus "${decodeURIComponent(rangkuman?.fileInfo?.originalName || 'Rangkuman')}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const savedData = await SecureStore.getItemAsync(STORAGE_KEY);

                            if (!savedData) {
                                Alert.alert('Info', 'Data tidak ditemukan');
                                router.back();
                                return;
                            }

                            let parsedData: ApiResponse[] = [];

                            try {
                                parsedData = JSON.parse(savedData);
                                if (!Array.isArray(parsedData)) {
                                    console.warn('Data bukan array, resetting...');
                                    parsedData = [];
                                }
                            } catch (parseError) {
                                console.error('Error parsing data:', parseError);
                                // Jika parsing error, reset storage
                                await SecureStore.deleteItemAsync(STORAGE_KEY);
                                Alert.alert('Sukses', 'Rangkuman berhasil dihapus');
                                router.back();
                                return;
                            }

                            // Filter dan simpan
                            const originalLength = parsedData.length;
                            const updatedData = parsedData.filter(item => {
                                if (!item || typeof item !== 'object' || !item.id) return true;
                                return item.id !== id;
                            });

                            if (updatedData.length === originalLength) {
                                Alert.alert('Info', 'Data tidak ditemukan');
                                router.back();
                                return;
                            }

                            if (updatedData.length > 0) {
                                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedData));
                            } else {
                                await SecureStore.deleteItemAsync(STORAGE_KEY);
                            }

                            // Tambahkan delay kecil untuk memastikan storage sudah terupdate
                            await new Promise(resolve => setTimeout(resolve, 100));

                            Alert.alert('Sukses', 'Rangkuman berhasil dihapus');

                            // Gunakan replace untuk mencegah kembali ke halaman yang sudah dihapus
                            router.replace('/(tabs)');

                        } catch (error) {
                            console.error('Error deleting rangkuman:', error);
                            Alert.alert('Error', 'Gagal menghapus rangkuman');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colorTheme.tint} />
                    <Text style={[styles.loadingText, { color: colorTheme.text }]}>Memuat rangkuman...</Text>
                </View>
            </ThemedView>
        );
    }

    if (!rangkuman) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={colorTheme.status.error} />
                    <Text style={[styles.errorText, { color: colorTheme.text }]}>Rangkuman tidak ditemukan</Text>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colorTheme.tint }]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    // Format nama file dan tanggal
    const fileName = decodeURIComponent(rangkuman.fileInfo?.originalName || 'Rangkuman');

    let uploadedDate = "Tanggal tidak valid";
    let savedDate = "Tanggal tidak valid";

    try {
        const uploaded = new Date(rangkuman.fileInfo?.uploadedAt);
        const saved = new Date(rangkuman.savedAt);

        if (!isNaN(uploaded.getTime())) {
            uploadedDate = uploaded.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }

        if (!isNaN(saved.getTime())) {
            savedDate = saved.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } catch (error) {
        console.error('Error formatting dates:', error);
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: colorTheme.background }]}>

            {/* Header */}
            <ThemedView style={[styles.header, { backgroundColor: colorTheme.background }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.backButtonHeader, { backgroundColor: `${colorTheme.icon}15` }]}
                    >
                        <Ionicons name="arrow-back" size={20} color={colorTheme.icon} />
                    </TouchableOpacity>

                    <ThemedText type="title" style={styles.headerTitle}>Detail Rangkuman</ThemedText>

                    <TouchableOpacity
                        onPress={deleteRangkuman}
                        style={[styles.deleteButton, { backgroundColor: `${colorTheme.status.error}15` }]}
                    >
                        <Ionicons name="trash-outline" size={20} color={colorTheme.status.error} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fileInfoContainer}>
                    <View style={[styles.fileIconContainer, {
                        backgroundColor: `${colorTheme.tint}15`,
                        borderColor: `${colorTheme.tint}30`
                    }]}>
                        <Ionicons name="document-text" size={28} color={colorTheme.tint} />
                    </View>
                    <View style={styles.fileInfoContent}>
                        <Text style={[styles.fileName, { color: colorTheme.text }]} numberOfLines={2}>
                            {fileName}
                        </Text>
                        <View style={styles.fileMeta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="cloud-upload-outline" size={14} color={colorTheme.icon} />
                                <Text style={[styles.metaText, { color: colorTheme.icon }]}>
                                    {uploadedDate}
                                </Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={14} color={colorTheme.icon} />
                                <Text style={[styles.metaText, { color: colorTheme.icon }]}>
                                    Disimpan: {savedDate}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ThemedView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, {
                        backgroundColor: colorTheme.cardBackground,
                        borderLeftWidth: 3,
                        borderLeftColor: '#3B82F6'
                    }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="book-outline" size={22} color="#3B82F6" />
                        </View>
                        <Text style={[styles.statNumber, { color: colorTheme.text }]}>
                            {rangkuman.data?.materi?.length || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: colorTheme.icon }]}>Materi</Text>
                    </View>

                    <View style={[styles.statCard, {
                        backgroundColor: colorTheme.cardBackground,
                        borderLeftWidth: 3,
                        borderLeftColor: '#F59E0B'
                    }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#FFFBEB' }]}>
                            <Ionicons name="list-outline" size={22} color="#F59E0B" />
                        </View>
                        <Text style={[styles.statNumber, { color: colorTheme.text }]}>
                            {rangkuman.data?.materi?.reduce((acc, curr) =>
                                acc + (curr.poinPenting?.length || 0), 0)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colorTheme.icon }]}>Poin</Text>
                    </View>

                    <View style={[styles.statCard, {
                        backgroundColor: colorTheme.cardBackground,
                        borderLeftWidth: 3,
                        borderLeftColor: '#10B981'
                    }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons name="help-circle-outline" size={22} color="#10B981" />
                        </View>
                        <Text style={[styles.statNumber, { color: colorTheme.text }]}>
                            {rangkuman.data?.materi?.reduce((acc, curr) =>
                                acc + (curr.soalLatihan?.length || 0), 0)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colorTheme.icon }]}>Soal</Text>
                    </View>
                </View>

                {/* Materi */}
                {rangkuman.data?.materi?.map((materi, index) => (
                    <AccordionSection
                        key={index}
                        title={`${index + 1}. ${materi.tema}`}
                        defaultExpanded={index === 0}
                        variant={index === 0 ? "default" : "default"}
                        subtitle={materi.rangkuman || "Pelajari rangkuman dan latihan soal"}
                    >
                        {/* Rangkuman */}
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: `${colorTheme.tint}15` }]}>
                                <Feather name="book-open" size={18} color={colorTheme.tint} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colorTheme.text }]}>Rangkuman</Text>
                        </View>
                        <CardRangkuman
                            title={materi.tema}
                            description={materi.rangkuman}
                        />

                        {/* Poin Penting */}
                        {(materi.poinPenting?.length || 0) > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <View style={[styles.sectionIcon, { backgroundColor: `${colorTheme.status.warning}15` }]}>
                                        <Feather name="check-circle" size={18} color={colorTheme.status.warning} />
                                    </View>
                                    <Text style={[styles.sectionTitle, { color: colorTheme.text }]}>Poin Penting</Text>
                                </View>
                                {materi.poinPenting?.map((point, pointIndex) => (
                                    <CardPoint key={pointIndex} point={point} />
                                ))}
                            </>
                        )}

                        {/* Soal Latihan */}
                        {(materi.soalLatihan?.length || 0) > 0 && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <View style={[styles.sectionIcon, { backgroundColor: `${colorTheme.status.success}15` }]}>
                                        <Feather name="edit-3" size={18} color={colorTheme.status.success} />
                                    </View>
                                    <Text style={[styles.sectionTitle, { color: colorTheme.text }]}>Soal Latihan</Text>
                                </View>
                                {materi.soalLatihan?.map((soal, soalIndex) => (
                                    <CardSoal
                                        key={soal.id || `soal-${soalIndex}`}
                                        soal={soal}
                                        nomor={soalIndex + 1}
                                        showJawaban={true}
                                    />
                                ))}
                            </>
                        )}
                    </AccordionSection>
                ))}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 24,
        // Hapus background solid jika menggunakan ThemedView
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    // --- Header Section ---
    header: {
        paddingTop: 64,
        paddingBottom: 28,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 28,
    },
    backButtonHeader: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
        textTransform: 'uppercase', // Membuat kesan lebih profesional
        opacity: 0.8,
    },
    deleteButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- File Info ---
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 18,
    },
    fileIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
    },
    fileInfoContent: {
        flex: 1,
    },
    fileName: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
        lineHeight: 28,
        letterSpacing: -0.5,
    },
    fileMeta: {
        flexDirection: 'column', // Ubah ke kolom agar lebih rapi di layar kecil
        gap: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 13,
        fontWeight: '500',
        opacity: 0.7,
    },
    // --- Body Content ---
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        paddingBottom: 60,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 36,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 12,
        alignItems: 'center',
        // Soft Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.6,
    },
    // --- Accordion Inside ---
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 28,
        marginBottom: 16,
    },
    sectionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    // --- Error State ---
    errorContainer: {
        alignItems: 'center',
        padding: 32,
        borderRadius: 32,
        width: '100%',
    },
    errorText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 28,
    },
    backButton: {
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});