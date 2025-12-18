import { createContext } from "react";

export type AuthContextType = {
    token: string | null
    login: (email: string, password: string) => Promise<void>
    loading: boolean
    userData: {
        user_id?: number;
        email?: string;
        name?: string;
    } | null
    error: string | null
    statusLogin: 'checking' | 'authenticated' | 'unauthenticated'
    isAuthenticated: () => boolean
    isCheckingAuth: () => boolean
    clearError: () => void
    checkAuthStatus: () => Promise<void>
    getCurrentUser: () => Promise<void>
    updateProfile: (updates: { name?: string; email?: string }) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)