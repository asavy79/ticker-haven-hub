import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { AuthState, UserSignIn, UserSignUp, AuthError } from "@/types/auth";
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
  signOutUser,
  sendPasswordReset,
  firebaseUserToAppUser,
} from "@/services/auth";

interface FirebaseAuthContextType extends AuthState {
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<
    { success: true } | { success: false; error: AuthError }
  >;
  resetPassword: (
    email: string
  ) => Promise<{ success: true } | { success: false; error: AuthError }>;
  clearError: () => void;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setAuthState((prev) => ({
          ...prev,
          firebaseUser,
          user: firebaseUser ? firebaseUserToAppUser(firebaseUser) : null,
          isLoading: false,
        }));

        if (!firebaseUser && !window.location.pathname.includes("/auth")) {
          navigate("/auth");
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  // const signIn = async (credentials: UserSignIn): Promise<{ success: true } | { success: false; error: AuthError }> => {
  //   setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

  //   const result = await signInUser(credentials);

  //   if (result.success) {
  //     setAuthState(prev => ({ ...prev, isLoading: false }));
  //     return { success: true };
  //   } else {
  //     setAuthState(prev => ({
  //       ...prev,
  //       isLoading: false,
  //       error: result.error.message
  //     }));
  //     return { success: false, error: result.error };
  //   }
  // };

  // const signUp = async (credentials: UserSignUp): Promise<{ success: true } | { success: false; error: AuthError }> => {
  //   setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

  //   const result = await signUpUser(credentials);

  //   if (result.success) {
  //     setAuthState(prev => ({ ...prev, isLoading: false }));
  //     return { success: true };
  //   } else {
  //     setAuthState(prev => ({
  //       ...prev,
  //       isLoading: false,
  //       error: result.error.message
  //     }));
  //     return { success: false, error: result.error };
  //   }
  // };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await signOutUser();

    if (result.success) {
      navigate("/");
    } else {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to sign out. Please try again.",
      }));
    }
  };

  const handleSignInWithGoogle = async (): Promise<
    { success: true } | { success: false; error: AuthError }
  > => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await signInWithGoogle();

    if (result.success) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: true };
    } else {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.error.message,
      }));
      return { success: false, error: result.error };
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: true } | { success: false; error: AuthError }> => {
    setAuthState((prev) => ({ ...prev, error: null }));
    return await sendPasswordReset(email);
  };

  const clearError = (): void => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const contextValue: FirebaseAuthContextType = {
    ...authState,
    signInWithGoogle: handleSignInWithGoogle,
    resetPassword,
    clearError,
    signOut,
  };

  return (
    <FirebaseAuthContext.Provider value={contextValue}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth(): FirebaseAuthContextType {
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }

  return context;
}

export { FirebaseAuthContext };
