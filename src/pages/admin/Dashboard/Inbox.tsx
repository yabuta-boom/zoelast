import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDocs, limit } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import { Mail, Car, Eye, Trash2, Download, Send, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: any;
  type: 'chat' | 'contact' | 'car_submission';
}

interface ChatSession {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: any;
  unread: number;
  type: 'chat' | 'contact' | 'car_submission';
}

const Inbox: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'chat' | 'contact' | 'car_submission'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const location = useLocation();

  // Check if there's a specific user to select from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedUserId) {
      setSelectedUser(state.selectedUserId);
      setSelectedType('chat');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        // Fetch chat messages
        const chatUsersRef = collection(db, 'users');
        const chatUsersSnap = await getDocs(chatUsersRef);
        
        const chatSessions = await Promise.all(
          chatUsersSnap.docs.map(async (userDoc) => {
            const messagesRef = collection(db, `users/${userDoc.id}/chat_messages`);
            const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
            const messageSnap = await getDocs(q);
            const lastMessage = messageSnap.docs[0]?.data();

            return {
              userId: userDoc.id,
              userName: userDoc.data().firstName + ' ' + userDoc.data().lastName,
              lastMessage: lastMessage?.text || 'No messages',
              lastMessageTime: lastMessage?.createdAt || null,
              unread: 0,
              type: 'chat' as const
            };
          })
        );

        // Fetch contact messages
        const contactRef = collection(db, 'contact_messages');
        const contactSnap = await getDocs(query(contactRef, orderBy('createdAt', 'desc')));
        const contactSessions = contactSnap.docs.map(doc => ({
          userId: doc.data().userId,
          userName: doc.data().name,
          lastMessage: doc.data().message,
          lastMessageTime: doc.data().createdAt,
          unread: 0,
          type: 'contact' as const
        }));

        // Fetch car submissions
        const carSubmissionsRef = collection(db, 'car_submissions');
        const carSubmissionsSnap = await getDocs(query(carSubmissionsRef, orderBy('createdAt', 'desc')));
        const carSubmissionSessions = carSubmissionsSnap.docs.map(doc => ({
          userId: doc.data().userId,
          userName: doc.data().name || 'Car Submission',
          lastMessage: `${doc.data().year} ${doc.data().make} ${doc.data().model}`,
          lastMessageTime: doc.data().createdAt,
          unread: 0,
          type: 'car_submission' as const
        }));

        // Combine all sessions
        const allSessions = [...chatSessions, ...contactSessions, ...carSubmissionSessions];
        
        // Sort by last message time
        allSessions.sort((a, b) => b.lastMessageTime?.seconds - a.lastMessageTime?.seconds);
        
        setChatSessions(allSessions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [db]);

  useEffect(() => {
    if (!selectedUser || !selectedType) return;

    let messagesRef;
    if (selectedType === 'chat') {
      messagesRef = collection(db, `users/${selectedUser}/chat_messages`);
    } else if (selectedType === 'contact') {
      messagesRef = collection(db, 'contact_messages');
    } else {
      messagesRef = collection(db, 'car_submissions');
    }

    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs
        .filter(doc => selectedType !== 'chat' ? doc.data().userId === selectedUser : true)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: selectedType
        })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [selectedUser, selectedType, db]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const messagesRef = collection(db, `users/${selectedUser}/chat_messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        userId: 'admin',
        userName: 'Admin',
        createdAt: new Date()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageTypeIcon = (type: 'chat' | 'contact' | 'car_submission') => {
    switch (type) {
      case 'chat':
        return <MessageCircle size={18} />;
      case 'contact':
        return <Mail size={18} />;
      case 'car_submission':
        return <Car size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] pt-6">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Chat Sessions List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Recent Messages</h3>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {chatSessions.map((session) => (
              <button
                key={`${session.userId}-${session.type}`}
                onClick={() => {
                  setSelectedUser(session.userId);
                  setSelectedType(session.type);
                }}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                  selectedUser === session.userId && selectedType === session.type ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon(session.type)}
                    <div>
                      <p className="font-medium">{session.userName}</p>
                      <p className="text-sm text-gray-600 truncate">{session.lastMessage}</p>
                    </div>
                  </div>
                  {session.lastMessageTime && (
                    <span className="text-xs text-gray-500">
                      {session.lastMessageTime.toDate().toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  {getMessageTypeIcon(selectedType)}
                  <h3 className="font-semibold">
                    {chatSessions.find(s => s.userId === selectedUser && s.type === selectedType)?.userName}
                  </h3>
                </div>
              </div>
              <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.userId === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.userName}
                      </div>
                      <p>{message.text || message.message}</p>
                      <div className="text-xs opacity-75 mt-1">
                        {message.createdAt.toDate().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedType === 'chat' && (
                <form onSubmit={handleSendMessage} className="p-4 border-t">
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
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;