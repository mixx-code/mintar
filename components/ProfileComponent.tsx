// app/(tabs)/profile-minimal.tsx
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/userAuth';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

const USER_DATA = {
    name: 'John Doe',
    email: 'john.doe@example.com',
};

export default function ProfileComponent() {
    const scheme = useColorScheme();
    const colors = Colors[scheme ?? 'light'];
    const { userData, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Avatar/Profile Icon */}
            <View style={styles.avatar}>
                <Ionicons
                    name="person"
                    size={60}
                    color="#fff"
                />
            </View>

            {/* Nama */}
            {
                userData && userData.name ? (
                    <>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {userData.name}
                        </Text>

                        {/* Email */}
                        <Text style={[styles.email, { color: colors.icon }]}>
                            {userData.email}
                        </Text>
                    </>
                ) :
                    (
                        <>
                            <Text style={[styles.name, { color: colors.text }]}>
                                Guest User
                            </Text>
                        </>
                    )
            }


            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        marginBottom: 40,
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});