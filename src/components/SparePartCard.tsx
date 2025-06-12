import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

interface SparePart {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  condition: string;
  compatibility: string[];
  partNumber: string;
  description: string;
  images: string[];
  stock: number;
  warranty: string;
}

interface SparePartCardProps {
  part: SparePart;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

const SparePartCard: React.FC<SparePartCardProps> = ({ part, isSaved, onSaveToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { db } = useFirebase();
  const mainImage = part.images && part.images.length > 0
    ? part.images[0]
    : 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/spare-parts/${part.id}`,
          action: 'save'
        }
      });
      return;
    }

    try {
      const savedRef = doc(db, `users/${user.uid}/saved_parts/${part.id}`);
      if (isSaved) {
        await deleteDoc(savedRef);
      } else {
        await setDoc(savedRef, {
          partRef: doc(db, 'spare_parts', part.id),
          savedAt: new Date()
        });
      }
      onSaveToggle?.();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { 
        state: { 
          from: '/chat',
          partId: part.id,
          partName: part.name,
          partPrice: part.price,
          partImage: mainImage,
          action: 'chat'
        } 
      });
      return;
    }
    navigate('/chat', { 
      state: { 
        partId: part.id,
        partName: part.name,
        partPrice: part.price,
        partImage: mainImage,
        partNumber: part.partNumber,
        partBrand: part.brand,
        partCondition: part.condition
      } 
    });
  };

  return (
    <Link 
      to={`/spare-parts/${part.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mainImage}
          alt={part.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {part.stock === 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-medium">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{part.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">{part.brand}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="text-sm text-gray-600">{part.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Part Number: {part.partNumber}</div>
          <div className="text-sm text-gray-600">Condition: {part.condition}</div>
          {part.warranty && (
            <div className="text-sm text-gray-600">Warranty: {part.warranty}</div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-700">
            {formatCurrency(part.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                isSaved 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
              <span className="text-sm">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={handleChat}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-sm">Chat</span>
            </button>
            <Link
              to={`/spare-parts/${part.id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              <span className="text-sm">View</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SparePartCard;