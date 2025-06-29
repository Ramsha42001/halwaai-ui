// halwaai-ui/src/utils/withAuth.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust the path if necessary

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin.halwai@gmail.com'; // Change this to your admin email
const ADMIN_PASSWORD = 'admin123'; // This is just for reference, we'll check email only

interface WithAuthOptions {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
    showUnauthorized?: boolean;
}

// Check if user is admin based on email
const isAdminUser = (user: User | null): boolean => {
    if (!user || !user.email) return false;
    return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

// Unauthorized component
const UnauthorizedAccess = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have admin permissions to access this page.</p>
            <p className="text-sm text-gray-500 mb-4">Please contact the administrator if you need access.</p>
            <button
                onClick={() => window.history.back()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go Back
            </button>
        </div>
    </div>
);

// Enhanced withAuth HOC
const withAuth = (
    WrappedComponent: React.ComponentType,
    options: WithAuthOptions = {}
) => {
    const {
        requireAuth = true,
        requireAdmin = false,
        redirectTo = '/login',
        showUnauthorized = true
    } = options;

    const AuthenticatedComponent = (props: any) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [user, setUser] = useState<User | null>(null);
        const [hasAdminAccess, setHasAdminAccess] = useState(false);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                setLoading(true);

                if (firebaseUser) {
                    setUser(firebaseUser);
                    setIsAuthenticated(true);

                    // Check if user has admin access
                    const isAdmin = isAdminUser(firebaseUser);
                    setHasAdminAccess(isAdmin);

                    console.log(`User ${firebaseUser.email} - Admin access: ${isAdmin}`);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setHasAdminAccess(false);

                    if (requireAuth) {
                        router.push(redirectTo);
                    }
                }

                setLoading(false);
            });

            return () => unsubscribe();
        }, [router, requireAuth, redirectTo]);

        // Show loading while checking authentication
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        // If auth is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        // If admin access is required but user is not admin
        if (requireAdmin && !hasAdminAccess) {
            return showUnauthorized ? <UnauthorizedAccess /> : null;
        }

        // User is authorized, render the component
        return isAuthenticated && (!requireAdmin || hasAdminAccess) ? (
            <WrappedComponent {...props} />
        ) : null;
    };

    // Set display name for debugging
    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

    return AuthenticatedComponent;
};

// Convenience wrapper for admin-only components
export const withAdminAuth = (
    WrappedComponent: React.ComponentType,
    options: Omit<WithAuthOptions, 'requireAdmin'> = {}
) => {
    return withAuth(WrappedComponent, { ...options, requireAdmin: true });
};

// Hook to check admin status (bonus)
export const useAdminStatus = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsAdmin(firebaseUser ? isAdminUser(firebaseUser) : false);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        adminEmail: ADMIN_EMAIL
    };
};

export default withAuth;