import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Dummy admin credentials for development
const DUMMY_ADMIN = {
  email: 'admin',
  password: 'admin'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for dummy admin credentials
      if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
        // Create a mock user object for the dummy admin
        const dummyUser = {
          uid: 'dummy-admin-uid',
          email: DUMMY_ADMIN.email,
          displayName: 'Admin User',
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: Date.now().toString(),
            lastSignInTime: Date.now().toString()
          },
          providerData: [],
          refreshToken: 'dummy-refresh-token',
          tenantId: null,
          delete: () => Promise.resolve(),
          getIdToken: () => Promise.resolve('dummy-token'),
          getIdTokenResult: () => Promise.resolve({
            token: 'dummy-token',
            authTime: new Date().toISOString(),
            issuedAtTime: new Date().toISOString(),
            expirationTime: new Date(Date.now() + 3600000).toISOString(),
            signInProvider: null,
            claims: {}
          }),
          reload: () => Promise.resolve(),
          toJSON: () => ({})
        } as User;

        setUser(dummyUser);
        return;
      }

      // Regular Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Prevent creating account with dummy admin credentials
      if (email === DUMMY_ADMIN.email) {
        throw new Error('This email is reserved');
      }
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear dummy admin session if it exists
      if (user?.uid === 'dummy-admin-uid') {
        setUser(null);
        return;
      }
      // Regular Firebase logout
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        toast.error('Please allow popups for this website to sign in with Google');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again');
      } else {
        console.error('Google sign-in error:', error);
        throw new Error('Failed to sign in with Google');
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Prevent password reset for dummy admin
      if (email === DUMMY_ADMIN.email) {
        throw new Error('Cannot reset password for this account');
      }
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      }
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}