import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext(undefined);

const USER_KEY = 'payme.user.v2';
const USERS_DB_KEY = 'payme.users.db.v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem(USER_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inSetupGroup = segments[0] === 'onboarding' || segments[0] === 'setup' || segments[0] === 'login' || segments[0] === 'signup';

    if (!user && inAuthGroup) {

      router.replace('/onboarding');
    } else if (user && inSetupGroup) {

      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  const signUp = async (name, email, password) => {
    try {
      setIsLoading(true);

      const dbString = await AsyncStorage.getItem(USERS_DB_KEY);
      const usersDb = dbString ? JSON.parse(dbString) : {};

      if (usersDb[email]) {
        Alert.alert('Error', 'User already exists with this email.');
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        password,
        currency: '₹',
        createdAt: Date.now(),
      };

      usersDb[email] = newUser;
      await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);

    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);

      const dbString = await AsyncStorage.getItem(USERS_DB_KEY);
      const usersDb = dbString ? JSON.parse(dbString) : {};

      const userRecord = usersDb[email];

      if (userRecord && userRecord.password === password) {

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userRecord));
        setUser(userRecord);
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const completeSetup = async (profileData) => {

    try {
      setIsLoading(true);
      const userData = {
        ...profileData,
        id: 'user_' + Date.now(),
        createdAt: Date.now(),
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    await completeSetup({
      name: 'Guest User',
      currency: '₹',
      image: null,
      isGuest: true,
    });
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      const updatedUser = { ...user, ...updates };

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (user.email) {
        const dbString = await AsyncStorage.getItem(USERS_DB_KEY);
        const usersDb = dbString ? JSON.parse(dbString) : {};
        if (usersDb[user.email]) {
          usersDb[user.email] = { ...usersDb[user.email], ...updates };
          await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null);

    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, completeSetup, loginAsGuest, updateProfile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
