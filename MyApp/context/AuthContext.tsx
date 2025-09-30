import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, signInWithCredential, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const googleExtra = (Constants.expoConfig?.extra as any)?.googleAuth || {};
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: googleExtra.webClientId,
    iosClientId: googleExtra.iosClientId,
    androidClientId: googleExtra.androidClientId,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, credential).catch(() => {});
      }
    }
  }, [response]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  const value = useMemo<AuthContextType>(() => ({ user, initializing, signIn, signUp, signOut, signInWithGoogle }), [user, initializing, signIn, signUp, signOut, signInWithGoogle]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


