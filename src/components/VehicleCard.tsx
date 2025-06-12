import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Link, useNavigate } from 'react-router-dom';
import { BookmarkPlus, BookmarkCheck, MessageCircle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  body: string;
  mileage: number;
  fuelEconomy: {
    hwy: string;
    city: string;
  };
  exterior: string;
  interior: string;
  engine: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  vin: string;
  stockNumber: string;
  doors: number;
  passengers: number;
  condition: string;
  description: string;
  images: string[];
  features: string[];
  sold: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  isTradeIn?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSaved, onSaveToggle, isTradeIn = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { db } = useFirebase();
  const mainImage = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0]
    : 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/vehicle/${vehicle.id}`,
          action: 'save'
        }
      });
      return;
    }

    try {
      const savedRef = doc(db, `users/${user.uid}/saved_vehicles/${vehicle.id}`);
      if (isSaved) {
        await deleteDoc(savedRef);
      } else {
        await setDoc(savedRef, {
          vehicleRef: doc(db, 'vehicles', vehicle.id),
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
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          vehiclePrice: vehicle.price,
          vehicleImage: mainImage,
          action: 'chat'
        } 
      });
      return;
    }
    navigate('/chat', { 
      state: { 
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehiclePrice: vehicle.price,
        vehicleImage: mainImage
      } 
    });
  };

  return (
    <Link 
      to={`/vehicle/${vehicle.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mainImage} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {vehicle.sold && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-medium">
            {t('vehicle.sold')}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-xl font-bold text-blue-700 mb-2">
          {formatCurrency(vehicle.price)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('vehicle.mileage')}:</span> {typeof vehicle.mileage === 'number' ? vehicle.mileage.toLocaleString() : 'N/A'} mi
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('vehicle.transmission')}:</span> {vehicle.transmission || 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('vehicle.engine')}:</span> {vehicle.engine || 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{t('vehicle.fuel')}:</span> {vehicle.fuelType || 'N/A'}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
              isSaved 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
            <span className="text-sm">{isSaved ? t('vehicle.saved') : t('vehicle.save')}</span>
          </button>
          <button
            onClick={handleChat}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-sm">{t('vehicle.chat')}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/vehicle/${vehicle.id}`);
            }}
            className="flex-1 bg-blue-600 text-white text-center py-1.5 px-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            {isTradeIn ? t('vehicle.interested') : t('vehicle.viewDetails')}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;