import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Appearance,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

export default function ProfileComponent() {
    const scheme = useColorScheme();
    const colors = Colors[scheme ?? 'light'];
    const { userData, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Fungsi untuk toggle tema secara manual (berlaku untuk sesi ini)
    const toggleTheme = () => {
        const nextScheme = scheme === 'dark' ? 'light' : 'dark';
        Appearance.setColorScheme(nextScheme);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Header Theme Toggle */}
            <View style={styles.headerAction}>
                <TouchableOpacity
                    style={[styles.themeButton, { backgroundColor: colors.cardBackground }]}
                    onPress={toggleTheme}
                >
                    <Ionicons
                        name={scheme === 'dark' ? "sunny" : "moon"}
                        size={22}
                        color={colors.tint}
                    />
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileCard}>
                <LinearGradient
                    colors={[colors.gradientPrimaryStart, colors.gradientPrimaryEnd] as const}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                >
                    <View style={[styles.avatarInner, { backgroundColor: colors.background }]}>
                        <Ionicons
                            name="person"
                            size={50}
                            color={colors.tint}
                        />
                    </View>
                </LinearGradient>

                <View style={styles.infoContainer}>
                    {userData && userData.name ? (
                        <>
                            <Text style={[styles.name, { color: colors.text }]}>
                                {userData.name}
                            </Text>
                            <Text style={[styles.email, { color: colors.icon }]}>
                                {userData.email}
                            </Text>
                        </>
                    ) : (
                        <Text style={[styles.name, { color: colors.text }]}>
                            Guest User
                        </Text>
                    )}
                </View>
            </View>

            {/* Menu Section */}
            {/* <View style={styles.menuSection}>
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}>
                    <Ionicons name="settings-outline" size={22} color={colors.text} />
                    <Text style={[styles.menuText, { color: colors.text }]}>Pengaturan</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}>
                    <Ionicons name="shield-checkmark-outline" size={22} color={colors.text} />
                    <Text style={[styles.menuText, { color: colors.text }]}>Privasi</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                </TouchableOpacity>
            </View> */}

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutWrapper}
                onPress={handleLogout}
            >
                <LinearGradient
                    colors={scheme === 'dark' ? ['#ef4444', '#991b1b'] : ['#fee2e2', '#fecaca']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.logoutButton}
                >
                    <Ionicons name="log-out-outline" size={20} color={scheme === 'dark' ? '#fff' : '#b91c1c'} />
                    <Text style={[styles.logoutText, { color: scheme === 'dark' ? '#fff' : '#b91c1c' }]}>
                        Keluar Akun
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    headerAction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 60,
        marginBottom: 20,
    },
    themeButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarGradient: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarInner: {
        width: 102,
        height: 102,
        borderRadius: 51,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    email: {
        fontSize: 15,
        fontWeight: '500',
        marginTop: 4,
        opacity: 0.7,
    },
    menuSection: {
        gap: 12,
        marginBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    logoutWrapper: {
        width: '100%',
    },
    logoutButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '800',
    },
});