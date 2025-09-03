import { useFirebaseAuth } from '@/contexts/firebase-auth-context';
import { AppUser } from '@/types/auth';

// Legacy hook that wraps the new Firebase auth context
// This maintains backward compatibility with existing components
export function useAuth() {
  const firebaseAuth = useFirebaseAuth();

  return {
    user: firebaseAuth.user as AppUser | null,
    isLoading: firebaseAuth.isLoading,
    error: firebaseAuth.error,
    login: firebaseAuth.signIn,
    createUser: firebaseAuth.signUp,
    logout: firebaseAuth.signOut,
    signIn: firebaseAuth.signIn,
    signUp: firebaseAuth.signUp,
    signInWithGoogle: firebaseAuth.signInWithGoogle,
    signOut: firebaseAuth.signOut,
    resetPassword: firebaseAuth.resetPassword,
    clearError: firebaseAuth.clearError,
  };
}

// Export the Firebase auth hook directly for new components
export { useFirebaseAuth } from '@/contexts/firebase-auth-context';

// Re-export the provider for convenience
export { FirebaseAuthProvider as AuthProvider } from '@/contexts/firebase-auth-context';
