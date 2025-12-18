import * as SecureStore from 'expo-secure-store';

const AUTH_KEYS = {
    TOKEN: 'auth_token',
    USER_ID: 'user_id',
    USER_EMAIL: 'user_email',
    USER_NAME: 'user_name',
    REMEMBER_ME: 'remember_me',
};

/**
 * Type LoginData dari requirement
 */
export type LoginData = {
    token?: string;
    data?: {
        user_id?: number;
        email?: string;
        name?: string;
    };
};

export type SaveLoginDataParams = LoginData & {
    rememberMe?: boolean;
};

export const AuthService = {
    /**
     * Simpan data login berdasarkan type LoginData
     */
    async saveLoginData(data: SaveLoginDataParams): Promise<boolean> {
        try {
            // Simpan token jika ada
            if (data.token) {
                await SecureStore.setItemAsync(AUTH_KEYS.TOKEN, data.token);
            }

            // Simpan user data jika ada
            if (data.data) {
                if (data.data.user_id !== undefined) {
                    await SecureStore.setItemAsync(AUTH_KEYS.USER_ID, String(data.data.user_id));
                }

                if (data.data.email) {
                    await SecureStore.setItemAsync(AUTH_KEYS.USER_EMAIL, data.data.email);
                }

                if (data.data.name) {
                    await SecureStore.setItemAsync(AUTH_KEYS.USER_NAME, data.data.name);
                }
            }

            // Simpan remember me preference
            if (data.rememberMe !== undefined) {
                await SecureStore.setItemAsync(AUTH_KEYS.REMEMBER_ME, String(data.rememberMe));
            }

            return true;
        } catch (error) {
            console.error('Error saving login data:', error);
            return false;
        }
    },

    /**
     * Ambil token dari secure store
     */
    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(AUTH_KEYS.TOKEN);
    },

    /**
     * Ambil semua data user dalam format LoginData
     */
    async getLoginData(): Promise<LoginData | null> {
        try {
            const [token, userId, email, name] = await Promise.all([
                SecureStore.getItemAsync(AUTH_KEYS.TOKEN),
                SecureStore.getItemAsync(AUTH_KEYS.USER_ID),
                SecureStore.getItemAsync(AUTH_KEYS.USER_EMAIL),
                SecureStore.getItemAsync(AUTH_KEYS.USER_NAME),
            ]);

            // Jika tidak ada token, return null
            if (!token) {
                return null;
            }

            const loginData: LoginData = {
                token: token,
            };

            // Hanya tambah data jika ada minimal satu field user
            if (userId || email || name) {
                loginData.data = {};

                if (userId) {
                    loginData.data.user_id = parseInt(userId, 10);
                }

                if (email) {
                    loginData.data.email = email;
                }

                if (name) {
                    loginData.data.name = name;
                }
            }

            return loginData;
        } catch (error) {
            console.error('Error getting login data:', error);
            return null;
        }
    },

    /**
     * Ambil data user saja (tanpa token)
     */
    async getUserData(): Promise<LoginData['data'] | null> {
        try {
            const loginData = await this.getLoginData();
            return loginData?.data || null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    /**
     * Cek apakah user sudah login (ada token)
     */
    async isLoggedIn(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    },

    /**
     * Ambil user ID jika ada
     */
    async getUserId(): Promise<number | null> {
        try {
            const userId = await SecureStore.getItemAsync(AUTH_KEYS.USER_ID);
            return userId ? parseInt(userId, 10) : null;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    },

    /**
     * Ambil user email jika ada
     */
    async getUserEmail(): Promise<string | null> {
        return await SecureStore.getItemAsync(AUTH_KEYS.USER_EMAIL);
    },

    /**
     * Ambil user name jika ada
     */
    async getUserName(): Promise<string | null> {
        return await SecureStore.getItemAsync(AUTH_KEYS.USER_NAME);
    },

    /**
     * Ambil remember me preference
     */
    async getRememberMe(): Promise<boolean> {
        try {
            const rememberMe = await SecureStore.getItemAsync(AUTH_KEYS.REMEMBER_ME);
            return rememberMe === 'true';
        } catch (error) {
            console.error('Error getting remember me preference:', error);
            return false;
        }
    },

    /**
     * Hapus semua data login (logout)
     */
    async clearLoginData(): Promise<boolean> {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(AUTH_KEYS.TOKEN),
                SecureStore.deleteItemAsync(AUTH_KEYS.USER_ID),
                SecureStore.deleteItemAsync(AUTH_KEYS.USER_EMAIL),
                SecureStore.deleteItemAsync(AUTH_KEYS.USER_NAME),
                SecureStore.deleteItemAsync(AUTH_KEYS.REMEMBER_ME),
            ]);
            return true;
        } catch (error) {
            console.error('Error clearing login data:', error);
            return false;
        }
    },

    /**
     * Update partial user data
     */
    async updateUserData(userData: Partial<LoginData['data']>): Promise<boolean> {
        try {
            if (!userData) {
                return false;
            }

            if (userData.user_id !== undefined) {
                await SecureStore.setItemAsync(AUTH_KEYS.USER_ID, String(userData.user_id));
            }

            if (userData.email) {
                await SecureStore.setItemAsync(AUTH_KEYS.USER_EMAIL, userData.email);
            }

            if (userData.name) {
                await SecureStore.setItemAsync(AUTH_KEYS.USER_NAME, userData.name);
            }

            return true;
        } catch (error) {
            console.error('Error updating user data:', error);
            return false;
        }
    },

    /**
     * Update token saja
     */
    async updateToken(token: string): Promise<boolean> {
        try {
            await SecureStore.setItemAsync(AUTH_KEYS.TOKEN, token);
            return true;
        } catch (error) {
            console.error('Error updating token:', error);
            return false;
        }
    },

    /**
     * Cek dan validasi login state
     */
    async validateLogin(): Promise<{
        isValid: boolean;
        loginData: LoginData | null;
    }> {
        const loginData = await this.getLoginData();

        if (!loginData || !loginData.token) {
            return { isValid: false, loginData: null };
        }

        // Di sini bisa ditambahkan validasi token expiry
        // Contoh: cek apakah token masih valid
        const isValid = true; // Ganti dengan validasi JWT yang sesungguhnya

        return { isValid, loginData };
    },
};

// Helper functions untuk common use cases
export const authHelpers = {
    /**
     * Contoh penggunaan untuk login
     */
    async handleLoginResponse(response: { token: string; user: LoginData['data'] }, rememberMe: boolean = false): Promise<boolean> {
        const loginData: SaveLoginDataParams = {
            token: response.token,
            data: response.user,
            rememberMe,
        };

        return await AuthService.saveLoginData(loginData);
    },

    /**
     * Contoh untuk logout
     */
    async handleLogout(): Promise<boolean> {
        return await AuthService.clearLoginData();
    },

    /**
     * Get auth headers untuk API calls
     */
    async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await AuthService.getToken();

        if (!token) {
            return {};
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    },
};