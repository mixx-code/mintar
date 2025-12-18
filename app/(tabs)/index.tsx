import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme } from 'react-native';

import AccordionSection from '@/components/AccordionSection';
import CardPoint from '@/components/result/card-point';
import CardRangkuman from '@/components/result/card-rangkuman';
import CardSoal from '@/components/result/card-soal';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import { getStyles } from '@/styles/home';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';


interface DocumentType {
  lastModified: number;
  name: string;
  uri: string;
  mimeType: string;
  size: number;
}

interface SoalLatihan {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  jawaban: string;
}

interface MateriItem {
  tema: string;
  rangkuman: string;
  poinPenting: string[];
  soalLatihan: SoalLatihan[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    materi: MateriItem[];
  };
  fileInfo: {
    originalName: string;
    storedName: string;
    filePath: string;
    fileUrl: string;
    size: number;
    uploadedAt: string;
  };
}

// Key untuk menyimpan data di SecureStore
const STORAGE_KEY = 'saved_api_data';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colorTheme = Colors[scheme ?? 'dark'];
  const baseStyles = getStyles(colorTheme);

  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [savedDataList, setSavedDataList] = useState<ApiResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingSave, setShowFloatingSave] = useState(false);

  const { token, userData, isAuthenticated, isCheckingAuth, error } = useAuth();

  // Load saved data saat komponen mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Tampilkan floating save button hanya ketika ada data hasil generate
  useEffect(() => {
    // Tampilkan hanya jika:
    // 1. Ada data API yang valid
    // 2. Data berhasil digenerate (success: true)
    // 3. Ada materi yang ditampilkan
    const shouldShowFloatingSave = !!(
      apiData &&
      apiData.success &&
      apiData.data?.materi?.length > 0
    );

    setShowFloatingSave(shouldShowFloatingSave);
  }, [apiData]);

  const loadSavedData = async () => {
    try {
      const savedData = await SecureStore.getItemAsync(STORAGE_KEY);
      if (savedData) {
        const parsedData: ApiResponse[] = JSON.parse(savedData);
        setSavedDataList(parsedData);
        console.log(`Loaded ${parsedData.length} saved items`);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled) {
        setDocument(result.assets[0] as DocumentType);
        // Reset data lama ketika memilih file baru
        setApiData(null);
        setShowFloatingSave(false);
        console.log('Document selected:', result.assets[0]);
      } else {
        console.log('No document selected');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!document) {
      Alert.alert('Peringatan', 'Pilih file PDF terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      setApiData(null);
      setShowFloatingSave(false);

      const formData = new FormData();
      formData.append('pdf', {
        uri: document.uri,
        type: document.mimeType || 'application/pdf',
        name: document.name || 'document.pdf',
      } as any);

      const response = await fetch('https://backend-mintar.vercel.app/api/v1/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse = await response.json();
      console.log('AI Generation Result:', result);

      // CEK: Respons tidak memiliki struktur yang diharapkan
      if (!result.data || !result.data.materi) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Format Tidak Didukung',
          textBody: 'File yang diupload bukan materi pendidikan atau format tidak dikenali.',
          button: 'OK',
          onPressButton: () => Dialog.hide(),
          autoClose: 4000
        });
        return;
      }

      setApiData(result);

    } catch (error: any) {
      console.log('Error generating with AI:', error);

      // Handle error 429
      const match = error.message?.match(/\{.*\}/);
      if (match) {
        try {
          const errorData = JSON.parse(match[0]);
          if (errorData.status === 429) {
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: 'Masa Uji Coba Habis',
              textBody: errorData.message || 'Terlalu banyak request. Silakan login untuk akses lebih besar.',
              button: 'OK',
              onPressButton: () => Dialog.hide(),
              autoClose: 5000
            });
            return;
          }
        } catch (e) {
          // Error parsing JSON, lanjut ke error umum
        }
      }

      // Handle error umum jika terjadi
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Terjadi kesalahan saat memproses file',
        button: 'OK',
        onPressButton: () => Dialog.hide(),
        autoClose: 5000
      });

    } finally {
      setLoading(false);
    }
  };

  const saveApiData = async () => {
    // Cek jika belum login
    if (!isAuthenticated || !token) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Akses Dibatasi',
        textBody: 'Anda harus login terlebih dahulu untuk menyimpan data.',
        button: 'OK',
        onPressButton: () => Dialog.hide(),
        autoClose: 3000
      });
      return;
    }

    if (!apiData) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Tidak ada data untuk disimpan',
        button: 'OK',
        onPressButton: () => Dialog.hide(),
        autoClose: 3000
      });
      return;
    }

    try {
      setIsSaving(true);

      // Tambahkan informasi user yang menyimpan
      const dataToSave = {
        ...apiData,
        savedAt: new Date().toISOString(),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };

      // Tambahkan data baru ke daftar yang sudah ada
      const updatedList = [dataToSave, ...savedDataList];

      // Simpan ke SecureStore
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedList));

      // Update state
      setSavedDataList(updatedList);

      // Tampilkan alert sukses
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil!',
        textBody: 'Data berhasil disimpan ke koleksi Anda.',
        button: 'OK',
        onPressButton: () => Dialog.hide(),
        autoClose: 4000,
        onShow: () => console.log('Save success alert shown'),
        onHide: () => {
          console.log('Data saved successfully. Total items:', updatedList.length);
          // Sembunyikan floating button setelah berhasil save
          setShowFloatingSave(false);
        }
      });

    } catch (error: any) {
      console.error('Error saving data:', error);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: "gagal menyimpan data",
        button: 'OK',
        onPressButton: () => Dialog.hide(),
        autoClose: 5000
      });

    } finally {
      setIsSaving(false);
    }
  };


  // Gabungkan baseStyles dengan styles lokal
  const styles = {
    ...baseStyles,
    floatingSaveButton: {
      position: 'absolute' as const,
      bottom: 30,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1000,
    },
    savedDataInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: 12,
      backgroundColor: 'rgba(74, 111, 165, 0.1)',
      borderRadius: 12,
      marginTop: 20,
      marginHorizontal: 20,
      alignSelf: 'center' as const,
    },
    container: {
      flex: 1,
      marginTop: 35,
    },
  };

  return (
    <ThemedView style={[baseStyles.container, styles.container]}>
      {!document && (
        <ThemedText style={{ textAlign: 'center', fontSize: 20 }}>
          Mau Rangkum Materi Apa?
        </ThemedText>
      )}

      <TouchableOpacity disabled={loading} onPress={pickDocument} style={{ minHeight: 80 }}>
        <ThemedView style={baseStyles.areaFile}>
          {document ? (
            <ThemedView style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'transparent' }}>
              <LottieView
                source={require('../../assets/lottie/success.json')}
                autoPlay
                loop={false}
                style={{ width: 80, height: 80, backgroundColor: 'transparent' }}
              />
              <ThemedText style={{ backgroundColor: 'transparent' }}>
                {document.name}
              </ThemedText>
              <ThemedText style={{ backgroundColor: 'transparent', fontSize: 12, marginTop: 5 }}>
                {(document.size / 1024 / 1024).toFixed(2)} MB
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'transparent' }}>
              <LottieView
                source={require('../../assets/lottie/PlikPDF.json')}
                autoPlay
                loop={false}
                style={{ width: 80, height: 80, backgroundColor: 'transparent' }}
              />
              <ThemedText style={{ backgroundColor: 'transparent' }}>
                Klik Untuk Memilih File PDF
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </TouchableOpacity>

      {document && (
        <ThemedView style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', gap: 10, height: 50 }}>
          <TouchableOpacity style={{ flex: 3 }} onPress={generateWithAI} disabled={loading}>
            <LinearGradient
              start={{ x: 2, y: 0 }}
              end={{ x: 0, y: 0 }}
              colors={loading ? [colorTheme.gradientSecondaryStart, colorTheme.gradientSecondaryEnd] : [colorTheme.gradientPrimaryStart, colorTheme.gradientPrimaryEnd]}
              style={baseStyles.buttonGenerate}
            >
              {loading ? (
                <LottieView
                  source={require('../../assets/lottie/sparkels.json')}
                  autoPlay
                  loop
                  style={{ width: 50, height: 50, backgroundColor: 'transparent' }}
                />
              ) : (
                <>
                  <Ionicons name="sparkles" size={24} color="#fff" />
                  <ThemedText style={baseStyles.text}>Generate With AI</ThemedText>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={pickDocument}
            disabled={loading}
          >
            <LinearGradient
              start={{ x: 2, y: 0 }}
              end={{ x: 0, y: 3 }}
              colors={[colorTheme.gradientSecondaryStart, colorTheme.gradientSecondaryEnd]}
              style={baseStyles.buttonReupload}
            >
              <ThemedText style={baseStyles.text}>Ganti PDF</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* Floating Save Button - Hanya muncul saat ada data hasil generate */}
      {showFloatingSave && (
        <TouchableOpacity
          onPress={saveApiData}
          disabled={isSaving}
          style={[
            styles.floatingSaveButton,
            {
              backgroundColor: isSaving ? '#ccc' : colorTheme.cardSoal,
              shadowColor: colorTheme.cardSoal,
            }
          ]}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <LottieView
              source={require('../../assets/lottie/sparkels.json')}
              autoPlay
              loop
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <Ionicons name="save-outline" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      )}

      {/* Tampilkan API Data */}
      {apiData && apiData.success && apiData.data.materi && (
        <ScrollView
          style={{ flex: 1, marginTop: 10 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {apiData.data.materi.map((materi, index) => (
            <AccordionSection
              key={index}
              title={`${index + 1}. ${materi.tema}`}
              defaultExpanded={index === 0}
            >
              <Text style={{ fontSize: 21, color: colorTheme.text, fontWeight: '600', marginVertical: 10 }}>
                📝 Rangkuman
              </Text>
              <CardRangkuman
                title={materi.tema}
                description={materi.rangkuman}
              />

              <Text style={{ fontSize: 21, color: colorTheme.text, fontWeight: '600', marginVertical: 10 }}>
                📌 Poin Penting
              </Text>
              {materi.poinPenting?.map((point, pointIndex) => (
                <CardPoint key={pointIndex} point={point} />
              ))}

              <Text style={{ fontSize: 21, color: colorTheme.text, fontWeight: '600', marginVertical: 10 }}>
                🧩 Soal Latihan
              </Text>

              {materi.soalLatihan.map((soal, soalIndex) => (
                <CardSoal
                  key={soal.id || `soal-${soalIndex}`}
                  soal={soal}
                  nomor={soalIndex + 1}
                  showJawaban={false}
                />
              ))}
            </AccordionSection>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}