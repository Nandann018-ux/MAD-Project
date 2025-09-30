import Constants from 'expo-constants';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

let app: FirebaseApp;
if (getApps().length === 0) {
  const config = (Constants.expoConfig?.extra as any)?.firebase;
  app = initializeApp(config);
  initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} else {
  app = getApps()[0]!;
}

export const auth = getAuth(app);

