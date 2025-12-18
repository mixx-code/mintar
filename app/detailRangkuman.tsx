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
                            if (savedData) {
                                const parsedData: ApiResponse[] = JSON.parse(savedData);
                                const updatedData = parsedData.filter(item => item.id !== id);
                                
                                await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedData));
                                Alert.alert('Sukses', 'Rangkuman berhasil dihapus');
                                router.back();
                            }
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
                <ActivityIndicator size="large" color="#4A6FA5" />
                <Text style={styles.loadingText}>Memuat rangkuman...</Text>
            </ThemedView>
        );
    }

    if (!rangkuman) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                <Text style={styles.errorText}>Rangkuman tidak ditemukan</Text>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
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
        <ThemedView style={[styles.container, {backgroundColor: colorTheme.background}]}>
            
            {/* Header */}
            <ThemedView style={[styles.header, { backgroundColor: colorTheme.background }]}>
                <ThemedView style={styles.headerTop}>
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={styles.backButtonHeader}
                    >
                        <Ionicons name="arrow-back" size={24} color={colorTheme.icon} />
                    </TouchableOpacity>
                    
                    <ThemedText style={styles.headerTitle}>Detail Rangkuman</ThemedText>
                    
                    <TouchableOpacity 
                        onPress={deleteRangkuman}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={22} color="#EF4444" />
                    </TouchableOpacity>
                </ThemedView>
                
                <View style={styles.fileInfoContainer}>
                    <View style={[styles.fileIconContainer, { backgroundColor: colorTheme.text + '20', borderRadius: 8 }]}>
                        <Ionicons name="document-text" size={28} color={colorTheme.icon} />
                    </View>
                    <View style={styles.fileInfoContent}>
                        <Text style={[styles.fileName, { color: colorTheme.text }]} numberOfLines={2}>
                            {fileName}
                        </Text>
                        <View style={styles.fileMeta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="cloud-upload-outline" size={12} color="#64748B" />
                                <Text style={styles.metaText}>
                                    {uploadedDate}
                                </Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={12} color="#64748B" />
                                <Text style={styles.metaText}>
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
                    <View style={[styles.statCard, {backgroundColor: '#ffffffa8'}]}>
                        <View style={[styles.statIcon, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="book-outline" size={20} color="#0369A1" />
                        </View>
                        <Text style={styles.statNumber}>
                            {rangkuman.data?.materi?.length || 0}
                        </Text>
                        <Text style={styles.statLabel}>Materi</Text>
                    </View>
                    
                    <View style={[styles.statCard, {backgroundColor: '#ffffffa8'}]}>
                        <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="list-outline" size={20} color="#D97706" />
                        </View>
                        <Text style={styles.statNumber}>
                            {rangkuman.data?.materi?.reduce((acc, curr) => 
                                acc + (curr.poinPenting?.length || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Poin</Text>
                    </View>
                    
                    <View style={[styles.statCard, {backgroundColor: '#ffffffa8'}]}>
                        <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="help-circle-outline" size={20} color="#16A34A" />
                        </View>
                        <Text style={styles.statNumber}>
                            {rangkuman.data?.materi?.reduce((acc, curr) => 
                                acc + (curr.soalLatihan?.length || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Soal</Text>
                    </View>
                </View>

                {/* Materi */}
                {rangkuman.data?.materi?.map((materi, index) => (
                    <AccordionSection
                        key={index}
                        title={`${index + 1}. ${materi.tema}`}
                        defaultExpanded={index === 0}
                    >
                        {/* Rangkuman */}
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={18} color="#4A6FA5" />
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
                                    <Ionicons name="checkmark-circle-outline" size={18} color="#D97706" />
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
                                    <Ionicons name="help-circle-outline" size={18} color="#16A34A" />
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
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748B',
    },
    errorText: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: '600',
        color: '#EF4444',
        textAlign: 'center',
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#4A6FA5',
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButtonHeader: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    deleteButton: {
        padding: 8,
    },
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 16,
    },
    fileIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileInfoContent: {
        flex: 1,
    },
    fileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
        lineHeight: 24,
    },
    fileMeta: {
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
        fontSize: 12,
        color: '#64748B',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
});