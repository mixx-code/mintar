import FormAuth from '@/components/FormAuth';
import ProfileComponent from '@/components/ProfileComponent';
import { useAuth } from '@/hooks/userAuth';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
    const { userData, isAuthenticated, isCheckingAuth, error } = useAuth();

    // Pengecekan status autentikasi
    if (isCheckingAuth()) {
        return (
            <View style={styles.fullScreenLoading}>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#4A6FA5" />
                </View>
            </View>
        );
    }

    // Jika ada error saat inisialisasi
    if (error && !userData) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                </View>
                <FormAuth />
            </View>
        );
    }

    // Tampilkan berdasarkan status login
    return (
        <View style={styles.container}>
            {isAuthenticated() ? (
                <ProfileComponent />
            ) : (
                <FormAuth />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullScreenLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
        padding: 40,
    },
    loadingTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginTop: 20,
    },
    loadingSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    errorContainer: {
        padding: 24,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#c53030',
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 14,
        color: '#742a2a',
        textAlign: 'center',
        lineHeight: 20,
    },
});