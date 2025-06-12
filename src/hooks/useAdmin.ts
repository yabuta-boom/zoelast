import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { useAuth } from '../components/auth/AuthContext';

interface AdminData {
  role?: string;
  createdAt?: Date;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setError(null);
      setLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check admins collection first
        const adminRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists()) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // If not in admins collection, check users collection for role
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as AdminData;
          setIsAdmin(userData?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        let errorMessage = 'An unexpected error occurred. Please try again later.';
        
        if (error instanceof Error) {
          if (error.message.includes('permission-denied')) {
            errorMessage = 'You do not have permission to access admin resources. Please ensure you are logged in with the correct account.';
          } else if (error.message.includes('not-found')) {
            errorMessage = 'User profile not found. Please ensure you are logged in.';
          }
        }
        
        setError(errorMessage);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, db]);

  return { isAdmin, loading, error };
};