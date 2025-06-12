import React, { createContext, useContext, ReactNode } from 'react';
import { db, auth, storage } from '../firebase/config';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

interface FirebaseContextType {
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db, auth, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
};