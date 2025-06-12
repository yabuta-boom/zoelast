import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isAdmin: false,
  error: null,
  unreadCount: 0
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Check users collection for admin role
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data()?.role === 'admin');
          } else {
            setIsAdmin(false);
          }

          // Listen for unread messages
          const messagesRef = collection(db, `users/${user.uid}/chat_messages`);
          const unreadQuery = query(messagesRef, where('read', '==', false));

          const messageUnsubscribe = onSnapshot(unreadQuery, (snapshot) => {
            setUnreadCount(snapshot.docs.length);
          });

          return () => messageUnsubscribe();

        } catch (error: any) {
          console.error('Error checking admin status:', error);
          if (error.code === 'unavailable') {
            setError('You are currently offline. Some features may be limited.');
          } else {
            setError('Error checking permissions. Please try again later.');
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
        setError(null);
        setUnreadCount(0);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, error, unreadCount }}>
      {children}
    </AuthContext.Provider>
  );
};