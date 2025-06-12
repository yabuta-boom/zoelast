import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { useAuth } from '../components/auth/AuthContext';
import { utils, writeFile } from 'xlsx';

export interface Message {
  id: string;
  type: 'contact' | 'car';
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
  userId: string;
}

export interface CarSubmission extends Message {
  type: 'car';
  carMake: string;
  carModel: string;
  carYear: number;
  body: string;
  mileage: number;
  transmission: string;
  engine: string;
  exterior: string;
  interior: string;
  description: string;
  images: string[];
  hwyMpg: number;
  cityMpg: number;
  submissionType: 'regular' | 'trade-in'; // Add submission type field
}

interface MessageContextType {
  messages: Message[];
  markAsRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  exportMessages: () => void;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch chat messages from the correct nested path
        const chatMessagesRef = collection(db, `users/${user.uid}/chat_messages`);
        const chatQuery = query(chatMessagesRef, orderBy('createdAt', 'desc'));
        const chatSnapshot = await getDocs(chatQuery);
        const chatMessages = chatSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'chat' as const,
          name: doc.data().userName || 'User',
          email: user.email || '',
          message: doc.data().text,
          date: doc.data().createdAt.toDate().toISOString(),
          read: doc.data().read || false,
          userId: doc.data().userId
        }));

        // Fetch contact messages
        const contactQuery = query(
          collection(db, 'contact_messages'),
          orderBy('createdAt', 'desc')
        );
        const contactSnapshot = await getDocs(contactQuery);
        const contactMessages = contactSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'contact' as const,
          name: doc.data().name,
          email: doc.data().email,
          message: doc.data().message,
          date: doc.data().createdAt.toDate().toISOString(),
          read: doc.data().read || false,
          userId: doc.data().userId
        }));

        // Fetch car submissions
        const carQuery = query(
          collection(db, 'car_submissions'),
          orderBy('createdAt', 'desc')
        );
        const carSnapshot = await getDocs(carQuery);
        const carSubmissions = carSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'car' as const,
          name: doc.data().name,
          email: doc.data().email,
          message: doc.data().description,
          date: doc.data().createdAt.toDate().toISOString(),
          read: doc.data().read || false,
          userId: doc.data().userId,
          carMake: doc.data().carMake,
          carModel: doc.data().carModel,
          carYear: doc.data().carYear,
          body: doc.data().body,
          mileage: doc.data().mileage,
          transmission: doc.data().transmission,
          engine: doc.data().engine,
          exterior: doc.data().exterior,
          interior: doc.data().interior,
          description: doc.data().description,
          images: doc.data().images || [],
          hwyMpg: doc.data().hwyMpg,
          cityMpg: doc.data().cityMpg,
          submissionType: doc.data().submissionType || 'regular' // Default to regular if not specified
        }));

        setMessages([...chatMessages, ...contactMessages, ...carSubmissions].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Handle permission errors gracefully
        if (error.code === 'permission-denied') {
          setMessages([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [db, user]);

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const message = messages.find(m => m.id === id);
      if (!message) return;

      if (message.type === 'chat') {
        const messageRef = doc(db, `users/${user.uid}/chat_messages/${id}`);
        await updateDoc(messageRef, { read: true });
      } else {
        const collectionName = message.type === 'car' ? 'car_submissions' : 'contact_messages';
        const messageRef = doc(db, collectionName, id);
        await updateDoc(messageRef, { read: true });
      }

      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, read: true } : m))
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!user) return;

    try {
      const message = messages.find(m => m.id === id);
      if (!message) return;

      if (message.type === 'chat') {
        const messageRef = doc(db, `users/${user.uid}/chat_messages/${id}`);
        await deleteDoc(messageRef);
      } else {
        const collectionName = message.type === 'car' ? 'car_submissions' : 'contact_messages';
        const messageRef = doc(db, collectionName, id);
        await deleteDoc(messageRef);
      }

      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const exportMessages = () => {
    const exportData = messages.map(message => ({
      Type: message.type === 'car' ? 
        `Car Submission (${(message as CarSubmission).submissionType})` : 
        'Contact Message',
      Name: message.name,
      Email: message.email,
      Date: new Date(message.date).toLocaleString(),
      Status: message.read ? 'Read' : 'Unread',
      ...(message.type === 'car' && {
        Make: (message as CarSubmission).carMake,
        Model: (message as CarSubmission).carModel,
        Year: (message as CarSubmission).carYear,
        Mileage: (message as CarSubmission).mileage,
        Body: (message as CarSubmission).body,
        Transmission: (message as CarSubmission).transmission,
        'Submission Type': (message as CarSubmission).submissionType
      }),
      Message: message.message
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Messages');
    writeFile(wb, `messages-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <MessageContext.Provider value={{ messages, markAsRead, deleteMessage, exportMessages }}>
      {children}
    </MessageContext.Provider>
  );
};