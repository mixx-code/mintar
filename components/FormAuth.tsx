import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export default function FormAuth() {
    const scheme = useColorScheme();
    const colorTheme = Colors[scheme ?? 'dark'];
    const { login, error, clearError, register, loading: authLoading } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Combined loading state
    const isLoading = authLoading || isSubmitting;

    // Monitor error dari useAuth
    useEffect(() => {
        if (error) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: isLogin ? 'Login Gagal' : 'Pendaftaran Gagal',
                textBody: error,
                button: 'OK',
                onPressButton: () => {
                    Dialog.hide();
                },
                autoClose: 5000 // auto close setelah 5 detik
            });
        }
    }, [error]);

    const handleSubmit = async () => {
        clearError();

        // Validasi
        if (!email.trim() || !password.trim()) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Perhatian',
                textBody: 'Email dan password harus diisi',
                button: 'OK',
                onPressButton: () => Dialog.hide(),
                autoClose: 3000
            });
            return;
        }

        if (!isLogin && !name.trim()) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Perhatian',
                textBody: 'Nama lengkap harus diisi',
                button: 'OK',
                onPressButton: () => Dialog.hide(),
                autoClose: 3000
            });
            return;
        }

        if (!isLogin && password.length < 6) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Perhatian',
                textBody: 'Password minimal 6 karakter',
                button: 'OK',
                onPressButton: () => Dialog.hide(),
                autoClose: 3000
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Perhatian',
                textBody: 'Format email tidak valid',
                button: 'OK',
                onPressButton: () => Dialog.hide(),
                autoClose: 3000
            });
            return;
        }

        try {
            setIsSubmitting(true);

            if (isLogin) {
                await login(email.trim(), password.trim());
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Sukses',
                    textBody: 'Berhasil login',
                    button: 'OK',
                    onPressButton: () => Dialog.hide(),
                    autoClose: 3000
                });

                // Jika berhasil login (tidak ada error)
                // Note: Biasanya login function akan redirect atau update state
                // Jadi kita tidak perlu menampilkan alert sukses di sini
                // kecuali jika ingin konfirmasi

                // Contoh jika ingin konfirmasi sukses:
                // Dialog.show({
                //     type: ALERT_TYPE.SUCCESS,
                //     title: 'Login Berhasil',
                //     textBody: 'Selamat datang kembali!',
                //     button: 'OK',
                //     onPressButton: () => {
                //         Dialog.hide();
                //         setName('');
                //         setEmail('');
                //         setPassword('');
                //     },
                //     autoClose: 3000
                // });

                // Reset form setelah login berhasil
                if (!error) {
                    setName('');
                    setEmail('');
                    setPassword('');
                }

            } else {
                await register(name.trim(), email.trim(), password.trim());

                // Jika berhasil register
                if (!error) {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Pendaftaran Berhasil!',
                        textBody: 'Akun Anda telah berhasil dibuat. Silakan login.',
                        button: 'OK',
                        onPressButton: () => {
                            Dialog.hide();
                            setIsLogin(true); // Switch ke login mode
                            setName('');
                            setEmail('');
                            setPassword('');
                        },
                        autoClose: 4000
                    });
                }
            }

        } catch (error: any) {
            console.error('Error:', error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error Sistem',
                textBody: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
                button: 'OK',
                onPressButton: () => Dialog.hide(),
                autoClose: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi untuk toast cepat (optional)
    const showToast = (message: string, type: 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' = 'INFO') => {
        Dialog.show({
            type: ALERT_TYPE[type],
            title: '',
            textBody: message,
            button: '',
            autoClose: 2000
        });
    };

    const switchMode = () => {
        // Tampilkan toast saat mode berubah (optional)
        // if (!isLoading) {
        //     showToast(isLogin ? 'Mode pendaftaran diaktifkan' : 'Mode login diaktifkan', 'INFO');
        // }

        setIsLogin(!isLogin);
        clearError();
        setName('');
        setEmail('');
        setPassword('');
    };

    // Fungsi untuk forgot password
    const handleForgotPassword = () => {
        Dialog.show({
            type: ALERT_TYPE.INFO,
            title: 'Lupa Password',
            textBody: 'Fitur reset password akan segera tersedia. Untuk sementara, hubungi administrator.',
            button: 'OK',
            onPressButton: () => Dialog.hide(),
            autoClose: false
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colorTheme.background }]}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colorTheme.text }]}>
                            {isLogin ? 'Login' : 'Daftar'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colorTheme.icon }]}>
                            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
                        </Text>
                    </View>

                    {/* Error Message inline (backup jika dialog tidak muncul) */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Form */}
                    <View style={styles.form}>
                        {!isLogin && (
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: colorTheme.text,
                                        borderColor: colorTheme.tint,
                                        backgroundColor: 'transparent'
                                    }
                                ]}
                                placeholder="Nama Lengkap"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={colorTheme.icon}
                                editable={!isLoading}
                                autoCapitalize="words"
                            />
                        )}

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: colorTheme.text,
                                    borderColor: colorTheme.tint,
                                    backgroundColor: 'transparent'
                                }
                            ]}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colorTheme.icon}
                            editable={!isLoading}
                            autoComplete="email"
                        />

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.passwordInput,
                                    {
                                        color: colorTheme.text,
                                        borderColor: colorTheme.tint,
                                        backgroundColor: 'transparent'
                                    }
                                ]}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colorTheme.icon}
                                editable={!isLoading}
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordButton}
                                onPress={() => {
                                    setShowPassword(!showPassword);
                                }}
                                disabled={isLoading}
                            >
                                <Text style={[styles.showPasswordText, { color: colorTheme.tint }]}>
                                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {!isLogin && (
                            <Text style={[styles.passwordHint, { color: colorTheme.icon }]}>
                                Minimal 6 karakter
                            </Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                {
                                    backgroundColor: isLoading ? colorTheme.cardBackground : colorTheme.tint,
                                    opacity: isLoading ? 0.7 : 1
                                }
                            ]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={styles.submitButtonText}>
                                        {isLogin ? 'Sedang masuk...' : 'Mendaftarkan...'}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {isLogin ? 'Masuk' : 'Daftar'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {isLogin && (
                            <TouchableOpacity
                                style={styles.forgotPasswordButton}
                                onPress={handleForgotPassword}
                                disabled={isLoading}
                            >
                                <Text style={[styles.forgotPasswordText, { color: colorTheme.tint }]}>
                                    Lupa Password?
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={[styles.switchText, { color: colorTheme.text }]}>
                            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                        </Text>
                        <TouchableOpacity
                            onPress={switchMode}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.switchLink,
                                { color: colorTheme.tint }
                            ]}>
                                {isLogin ? ' Daftar' : ' Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Loading Modal */}
            <Modal
                transparent={true}
                visible={isLoading}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colorTheme.background }]}>
                        <ActivityIndicator size="large" color={colorTheme.tint} />
                        <Text style={[styles.modalText, { color: colorTheme.text }]}>
                            {isLogin ? 'Sedang memproses login...' : 'Sedang memproses pendaftaran...'}
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    errorContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ff4444',
        backgroundColor: '#ff44441a',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    passwordInput: {
        paddingRight: 100,
    },
    passwordHint: {
        fontSize: 12,
        marginBottom: 16,
        marginLeft: 4,
        color: '#64748B',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 12,
        top: 14,
        padding: 4,
    },
    showPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    submitButton: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    forgotPasswordButton: {
        alignItems: 'center',
        padding: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    switchText: {
        fontSize: 16,
    },
    switchLink: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 30,
        borderRadius: 12,
        alignItems: 'center',
        gap: 20,
        width: '80%',
        maxWidth: 300,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
});