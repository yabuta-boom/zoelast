import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC34rZD_egIzgHdR3x2atvmEj37c_18W7k',
  authDomain: 'zoe-car-dealership.firebaseapp.com',
  projectId: 'zoe-car-dealership',
  storageBucket: 'zoe-car-dealership.appspot.com',
  messagingSenderId: '16972726998',
  appId: '1:16972726998:web:86e843f8f790965648ff77'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Google Auth Provider with custom parameters
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firebase persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firebase persistence not supported in this browser');
  }
});

// Add connection state listener
const connectionState = {
  isConnected: true,
  listeners: new Set<(isConnected: boolean) => void>()
};

// Function to add connection state listener
export const addConnectionStateListener = (listener: (isConnected: boolean) => void) => {
  connectionState.listeners.add(listener);
  // Immediately call with current state
  listener(connectionState.isConnected);
  
  // Return cleanup function
  return () => {
    connectionState.listeners.delete(listener);
  };
};

// Update connection state and notify listeners
const updateConnectionState = (isConnected: boolean) => {
  connectionState.isConnected = isConnected;
  connectionState.listeners.forEach(listener => listener(isConnected));
};

// Monitor online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => updateConnectionState(true));
  window.addEventListener('offline', () => updateConnectionState(false));
}

export { app, db, auth, storage, googleProvider };