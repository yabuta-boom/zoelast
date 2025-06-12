import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, addDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import { useAuth } from '../../components/auth/AuthContext';
import { Send, MessageCircle, Car, Settings, Reply } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  userName: string;
  vehicleId?: string;
  vehicleName?: string;
  vehiclePrice?: number;
  vehicleImage?: string;
  partId?: string;
  partName?: string;
  partPrice?: number;
  partImage?: string;
  partNumber?: string;
  partBrand?: string;
  partCondition?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
  userId: string;
}

interface LocationState {
  vehicleId?: string;
  vehicleName?: string;
  vehiclePrice?: number;
  vehicleImage?: string;
  partId?: string;
  partName?: string;
  partPrice?: number;
  partImage?: string;
  partNumber?: string;
  partBrand?: string;
  partCondition?: string;
}

interface ItemContext {
  vehicleId?: string;
  vehicleName?: string;
  vehiclePrice?: number;
  vehicleImage?: string;
  partId?: string;
  partName?: string;
  partPrice?: number;
  partImage?: string;
  partNumber?: string;
  partBrand?: string;
  partCondition?: string;
}

const Chat = () => {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<ItemContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const locationState = location.state as LocationState;

  useEffect(() => {
    if (locationState) {
      setActiveItem(locationState);
    }
  }, [locationState]);

  useEffect(() => {
    if (!user) return;

    // Fetch chat messages
    const messagesRef = collection(db, `users/${user.uid}/chat_messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      setLoading(false);
    });

    // Fetch contact messages
    const fetchContactMessages = async () => {
      const contactRef = collection(db, 'contact_messages');
      const contactSnap = await getDocs(query(contactRef, orderBy('createdAt', 'desc')));
      const contactData = contactSnap.docs
        .filter(doc => doc.data().userId === user.uid)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ContactMessage[];
      setContactMessages(contactData);
    };

    fetchContactMessages();

    return () => unsubscribe();
  }, [user, db]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      const messagesRef = collection(db, `users/${user.uid}/chat_messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || 'User',
        createdAt: new Date(),
        ...(activeItem?.vehicleId && {
          vehicleId: activeItem.vehicleId,
          vehicleName: activeItem.vehicleName,
          vehiclePrice: activeItem.vehiclePrice,
          vehicleImage: activeItem.vehicleImage
        }),
        ...(activeItem?.partId && {
          partId: activeItem.partId,
          partName: activeItem.partName,
          partPrice: activeItem.partPrice,
          partImage: activeItem.partImage,
          partNumber: activeItem.partNumber,
          partBrand: activeItem.partBrand,
          partCondition: activeItem.partCondition
        })
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleItemSelect = (item: ItemContext) => {
    setActiveItem(item);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center gap-2">
            <MessageCircle className="text-white" />
            <h1 className="text-2xl font-bold text-white">Chat with Support</h1>
          </div>

          {activeItem && (
            <div className="p-4 bg-blue-50 border-b flex items-center gap-4">
              {activeItem.vehicleId ? (
                <>
                  <Car className="text-blue-600" />
                  <div>
                    <p className="font-medium">{activeItem.vehicleName}</p>
                    {activeItem.vehiclePrice && (
                      <p className="text-sm text-blue-600">{formatCurrency(activeItem.vehiclePrice)}</p>
                    )}
                  </div>
                  {activeItem.vehicleImage && (
                    <img 
                      src={activeItem.vehicleImage} 
                      alt={activeItem.vehicleName} 
                      className="w-16 h-16 object-cover rounded-lg ml-auto"
                    />
                  )}
                </>
              ) : (
                <>
                  <Settings className="text-blue-600" />
                  <div>
                    <p className="font-medium">{activeItem.partName}</p>
                    <p className="text-sm text-gray-600">
                      {activeItem.partBrand} • {activeItem.partNumber} • {activeItem.partCondition}
                    </p>
                    {activeItem.partPrice && (
                      <p className="text-sm text-blue-600">{formatCurrency(activeItem.partPrice)}</p>
                    )}
                  </div>
                  {activeItem.partImage && (
                    <img 
                      src={activeItem.partImage} 
                      alt={activeItem.partName} 
                      className="w-16 h-16 object-cover rounded-lg ml-auto"
                    />
                  )}
                </>
              )}
            </div>
          )}

          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === user?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.userId === user?.uid
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.userId === user?.uid ? 'You' : message.userName}
                      </div>
                      {message.vehicleId && message.vehicleId !== activeItem?.vehicleId && (
                        <div className="mb-2 p-2 bg-white bg-opacity-10 rounded flex items-center gap-2">
                          <Car size={16} />
                          <span className="text-sm">{message.vehicleName}</span>
                          <button
                            onClick={() => handleItemSelect({
                              vehicleId: message.vehicleId!,
                              vehicleName: message.vehicleName!,
                              vehiclePrice: message.vehiclePrice,
                              vehicleImage: message.vehicleImage
                            })}
                            className="ml-auto p-1 hover:bg-white hover:bg-opacity-10 rounded"
                            title="Switch to this vehicle"
                          >
                            <Reply size={14} />
                          </button>
                        </div>
                      )}
                      {message.partId && message.partId !== activeItem?.partId && (
                        <div className="mb-2 p-2 bg-white bg-opacity-10 rounded flex items-center gap-2">
                          <Settings size={16} />
                          <span className="text-sm">{message.partName}</span>
                          <button
                            onClick={() => handleItemSelect({
                              partId: message.partId!,
                              partName: message.partName!,
                              partPrice: message.partPrice,
                              partImage: message.partImage,
                              partNumber: message.partNumber,
                              partBrand: message.partBrand,
                              partCondition: message.partCondition
                            })}
                            className="ml-auto p-1 hover:bg-white hover:bg-opacity-10 rounded"
                            title="Switch to this part"
                          >
                            <Reply size={14} />
                          </button>
                        </div>
                      )}
                      <p>{message.text}</p>
                      <div className="text-xs opacity-75 mt-1">
                        {message.createdAt.toDate().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;