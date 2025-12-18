import { AuthService, LoginData } from "@/services/auth";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = 'https://backend-mintar.vercel.app/api/v1';

// Status autentikasi
type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<{
        user_id?: number;
        email?: string;
        name?: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusLogin, setStatusLogin] = useState<AuthStatus>('checking');

    // Check auth status saat component mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('🔍 Initializing auth...');
                setStatusLogin('checking');
                
                const loginData = await AuthService.getLoginData();
                console.log('📦 Retrieved login data:', loginData);
                
                if (loginData?.token) {
                    setToken(loginData.token);
                    setUserData(loginData.data || null);
                    setStatusLogin('authenticated');
                    console.log('✅ User logged in:', loginData.data?.email);
                } else {
                    console.log('❌ No user logged in');
                    setToken(null);
                    setUserData(null);
                    setStatusLogin('unauthenticated');
                }
            } catch (err) {
                console.error('❌ Auth initialization error:', err);
                setToken(null);
                setUserData(null);
                setStatusLogin('unauthenticated');
            }
        };

        initializeAuth();
    }, []);

    /**
     * Login function sesuai dengan AuthContextType
     */
    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);
        setStatusLogin('checking');

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login API response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Process response sesuai dengan LoginData type
            const loginData: LoginData = {
                token: data.token || data.access_token || data.accessToken,
                data: {
                    user_id: data.data?.user_id || data.user?.id || data.user_id,
                    email: data.data?.email || data.user?.email || data.email,
                    name: data.data?.name || data.user?.name || data.name,
                }
            };

            console.log('Processed login data:', loginData);

            if (!loginData.token) {
                throw new Error('No token received from server');
            }

            // Save to SecureStore
            const saveSuccess = await AuthService.saveLoginData(loginData);
            
            if (!saveSuccess) {
                throw new Error('Failed to save login data');
            }

            // Update state
            setToken(loginData.token);
            setUserData(loginData.data || null);
            setStatusLogin('authenticated');

        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred during login';
            setError(errorMessage);
            setStatusLogin('unauthenticated');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register function sesuai dengan AuthContextType
     */
    const register = async (name: string, email: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);
        setStatusLogin('checking');

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log('Register API response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Auto login setelah register jika ada token
            if (data.token) {
                const loginData: LoginData = {
                    token: data.token,
                    data: {
                        user_id: data.user?.id || data.user_id,
                        email: data.user?.email || data.email,
                        name: data.user?.name || data.name,
                    }
                };

                console.log('Auto login data:', loginData);

                const saveSuccess = await AuthService.saveLoginData(loginData);
                
                if (saveSuccess) {
                    setToken(data.token);
                    setUserData(loginData.data || null);
                    setStatusLogin('authenticated');
                }
            } else {
                setStatusLogin('unauthenticated');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred during registration';
            setError(errorMessage);
            setStatusLogin('unauthenticated');
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout function
     */
    const logout = async (): Promise<void> => {
        setLoading(true);
        setStatusLogin('checking');
        
        try {
            await AuthService.clearLoginData();
            setToken(null);
            setUserData(null);
            setError(null);
            setStatusLogin('unauthenticated');
            console.log('✅ User logged out');
        } catch (err) {
            console.error('Logout error:', err);
            setStatusLogin('authenticated'); // Kembalikan ke authenticated jika gagal logout
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clear error function
     */
    const clearError = (): void => {
        setError(null);
    };

    /**
     * Check auth status function
     */
    const checkAuthStatus = async (): Promise<void> => {
        try {
            setStatusLogin('checking');
            const loginData = await AuthService.getLoginData();
            
            if (loginData?.token) {
                setToken(loginData.token);
                setUserData(loginData.data || null);
                setStatusLogin('authenticated');
            } else {
                setToken(null);
                setUserData(null);
                setStatusLogin('unauthenticated');
            }
        } catch (err) {
            console.error('Auth status check error:', err);
            setStatusLogin('unauthenticated');
            throw err;
        }
    };

    /**
     * Get current user function
     */
    const getCurrentUser = async (): Promise<void> => {
        try {
            setStatusLogin('checking');
            const loginData = await AuthService.getLoginData();
            
            if (loginData?.token) {
                setUserData(loginData.data || null);
                setStatusLogin('authenticated');
            } else {
                setUserData(null);
                setStatusLogin('unauthenticated');
            }
        } catch (err) {
            console.error('Get current user error:', err);
            setStatusLogin('unauthenticated');
            throw err;
        }
    };

    /**
     * Update profile function
     */
    const updateProfile = async (updates: { name?: string; email?: string }): Promise<void> => {
        try {
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            
            // Update di local storage
            await AuthService.updateUserData(updates);
            
            // Update state
            setUserData(prev => ({
                ...prev,
                ...updates
            }));

            setStatusLogin('authenticated');

        } catch (err: any) {
            console.error('Update profile error:', err);
            throw err;
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = (): boolean => {
        return statusLogin === 'authenticated' && token !== null;
    };

    /**
     * Check if auth is still checking
     */
    const isCheckingAuth = (): boolean => {
        return statusLogin === 'checking';
    };

    return (
        <AuthContext.Provider value={{
            token,
            login,
            loading,
            userData,
            error,
            clearError,
            checkAuthStatus,
            getCurrentUser,
            updateProfile,
            register,
            logout,
            statusLogin,
            isAuthenticated,
            isCheckingAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}