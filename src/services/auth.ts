import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser,
    SAMLAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserSignUp, UserSignIn, AppUser, AuthError } from '@/types/auth';
import { getAccount, createAccount } from './adminAuth';

// Helper function to convert Firebase user to AppUser
export function firebaseUserToAppUser(firebaseUser: FirebaseUser): AppUser {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        // App-specific fields would be populated from your backend if needed
        username: firebaseUser.displayName || undefined,
    };
}

// Helper function to convert Firebase error to AuthError
function firebaseErrorToAuthError(error: any): AuthError {
    return {
        code: error.code || 'unknown',
        message: getFirebaseErrorMessage(error.code || 'unknown'),
    };
}

// User-friendly error messages
function getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in was cancelled.';
        case 'auth/popup-blocked':
            return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
        case 'auth/cancelled-popup-request':
            return 'Sign-in was cancelled.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with this email using a different sign-in method.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Sign up with email and password
export async function signUpUser(credentials: UserSignUp): Promise<{ success: true; user: AppUser } | { success: false; error: AuthError }> {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );

        // Update display name if provided
        if (credentials.displayName) {
            await updateProfile(userCredential.user, {
                displayName: credentials.displayName,
            });
        }

        const appUser = firebaseUserToAppUser(userCredential.user);

        return {
            success: true,
            user: appUser,
        };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

// Sign in with email and password
export async function signInUser(credentials: UserSignIn): Promise<{ success: true; user: AppUser } | { success: false; error: AuthError }> {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );

        const appUser = firebaseUserToAppUser(userCredential.user);

        return {
            success: true,
            user: appUser,
        };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

// Sign out
export async function signOutUser(): Promise<{ success: true } | { success: false; error: AuthError }> {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<{ success: true; user: AppUser } | { success: false; error: AuthError }> {
    try {
        const provider = new GoogleAuthProvider();
        // Optional: Add additional scopes if needed
        // provider.addScope('profile');
        // provider.addScope('email');

        const result = await signInWithPopup(auth, provider);
        const appUser = firebaseUserToAppUser(result.user);


        const email = appUser.email;


        if (!email.endsWith("@colorado.edu")) {
            await signOutUser();
            return {
                success: false,
                error: { code: 'auth/invalid-email', message: 'Please use a Colorado email address.' },
            };

        }

        // const accountResult = await getAccount(appUser.uid);

        // if (!accountResult.success) {
        //     await signOutUser();
        //     return {
        //         success: false,
        //         error: { code: 'auth/account-not-found', message: 'Account not found.' },
        //     };
        // }

        // const userProfile = accountResult.user;


        // if (!userProfile) {
        //     const createAccountResult = await createAccount(appUser);
        //     if (!createAccountResult.success) {
        //         await signOutUser();
        //         return {
        //             success: false,
        //             error: { code: 'auth/account-not-found', message: 'Account not found.' },
        //         };
        //     }
        // }

        return {
            success: true,
            user: appUser,
        };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

export async function signInWithSSO() {

    try {
        // const handler = "https://quantx-auth.firebaseapp.com/__/auth/handler";
        const provider = new SAMLAuthProvider("saml.cu-identikey");
    
        const result = await signInWithPopup(auth, provider);
        const appUser = firebaseUserToAppUser(result.user);
        return {
            success: true,
            user: appUser,
        }
    
    } catch(error) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        }
    }


}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<{ success: true } | { success: false; error: AuthError }> {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

// Update user profile
export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<{ success: true } | { success: false; error: AuthError }> {
    try {
        if (!auth.currentUser) {
            return {
                success: false,
                error: { code: 'auth/no-current-user', message: 'No user is currently signed in.' },
            };
        }

        await updateProfile(auth.currentUser, updates);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: firebaseErrorToAuthError(error),
        };
    }
}

// Legacy functions for backward compatibility (can be removed once migration is complete)
export const createUser = signUpUser;
export const loginUser = signInUser;
export function removeTokens() {
    // No-op since Firebase handles tokens automatically
}
export async function getUser(): Promise<AppUser | null> {
    if (auth.currentUser) {
        return firebaseUserToAppUser(auth.currentUser);
    }
    return null;
}