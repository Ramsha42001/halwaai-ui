import { create } from 'zustand';
import { User } from 'firebase/auth';

// Define user roles
export type UserRole = 'user' | 'admin' | 'moderator';

// Extended user interface with role
export interface UserWithRole extends User {
    role?: UserRole;
    customClaims?: {
        role?: UserRole;
        isAdmin?: boolean;
    };
}

interface AuthState {
    user: UserWithRole | null;
    isLoading: boolean;
    setUser: (user: UserWithRole | null) => void;
    setLoading: (loading: boolean) => void;
    isAdmin: () => boolean;
    hasRole: (role: UserRole) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,

    setUser: (user) => set({ user }),

    setLoading: (loading) => set({ isLoading: loading }),

    // Check if current user is admin
    isAdmin: () => {
        const { user } = get();
        if (!user) return false;

        // Check custom claims first (recommended for Firebase)
        if (user.customClaims?.isAdmin || user.customClaims?.role === 'admin') {
            return true;
        }

        // Fallback to role property
        return user.role === 'admin';
    },

    // Check if user has specific role
    hasRole: (role: UserRole) => {
        const { user } = get();
        if (!user) return false;

        // Check custom claims first
        if (user.customClaims?.role === role) {
            return true;
        }

        // Fallback to role property
        return user.role === role;
    },

    logout: () => set({ user: null, isLoading: false }),
}));