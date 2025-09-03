import { User as FirebaseUser } from 'firebase/auth';

export type IsoDateString = string;

// Firebase Auth Types
export type UserSignUp = {
  email: string;
  password: string;
  displayName?: string;
};

export type UserSignIn = {
  email: string;
  password: string;
};

export type AuthError = {
  code: string;
  message: string;
};

// App User Type (extends Firebase user with app-specific data)
export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  // App-specific fields that might come from your backend
  username?: string;
  balance?: number;
  isAdmin?: boolean;
  createdAt?: IsoDateString;
};

// Firebase Auth State
export type AuthState = {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
};

// Legacy types for backward compatibility (can be removed once migration is complete)
export type UserCreate = UserSignUp;
export type UserLogin = UserSignIn;
