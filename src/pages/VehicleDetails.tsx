import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatters';

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
  fuelEconomy?: { hwy: string; city: string };
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
  video?: string;
  isTradeIn?: boolean;
}

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { db } = useFirebase();
  const { t } = useLanguage();
  
  // Check if this is a trade-in page based on URL path
  const isTradeInPage = window.location.pathname.includes('trade-in');

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return;

      try {
        const vehicleRef = doc(db, 'vehicles', id);
        const vehicleDoc = await getDoc(vehicleRef);
        
        if (vehicleDoc.exists()) {
          setVehicle({
            id: vehicleDoc.id,
            ...vehicleDoc.data()
          } as Vehicle);
        } else {
          setVehicle(null);
        }
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id, db]);

  const handleButtonClick = () => {
    if (isTradeInPage || vehicle?.isTradeIn) {
      // Navigate to Send Us Your Car page for trade-in vehicles with trade-in context
      navigate('/send-us-your-car', {
        state: {
          vehicleId: vehicle?.id,
          vehicleName: vehicle?.name,
          sourcePage: 'trade-in'
        }
      });
    } else {
      // Navigate to Contact page for regular vehicles
      navigate('/contact', {
        state: {
          vehicleDetails: {
            name: vehicle?.name,
            year: vehicle?.year,
            make: vehicle?.make,
            model: vehicle?.model,
            vin: vehicle?.vin,
            stockNumber: vehicle?.stockNumber
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full pt-24 flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="w-full pt-24">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900">Vehicle not found</h1>
          <button
            onClick={() => navigate('/inventory')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
              <img
                src={vehicle.images[activeImage] || 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'}
                alt={vehicle.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative pb-[56.25%] rounded-lg overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${vehicle.name} view ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            {/* Video Section */}
            {vehicle.video && (
              <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
                <video
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={vehicle.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {vehicle.body}
                </span>
                {vehicle.isTradeIn && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                    Trade-In
                  </span>
                )}
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(vehicle.price)}
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p>{vehicle.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Vehicle Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.year')}</h3>
                <p>{vehicle.year}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.make')}</h3>
                <p>{vehicle.make}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.model')}</h3>
                <p>{vehicle.model}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.bodyType')}</h3>
                <p>{vehicle.body}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.mileage')}</h3>
                <p>{vehicle.mileage.toLocaleString()} miles</p>
              </div>
              {vehicle.fuelEconomy && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{t('vehicle.fuelEconomy')}</h3>
                  <p>HWY: {vehicle.fuelEconomy.hwy}, City: {vehicle.fuelEconomy.city}</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.exterior')}</h3>
                <p>{vehicle.exterior}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.interior')}</h3>
                <p>{vehicle.interior}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.engine')}</h3>
                <p>{vehicle.engine}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.transmission')}</h3>
                <p>{vehicle.transmission}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.driveType')}</h3>
                <p>{vehicle.driveType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.fuelType')}</h3>
                <p>{vehicle.fuelType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.vin')}</h3>
                <p>{vehicle.vin}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.stockNumber')}</h3>
                <p>{vehicle.stockNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.doors')}</h3>
                <p>{vehicle.doors} {t('vehicle.doors')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.passengers')}</h3>
                <p>{vehicle.passengers} {t('vehicle.passengers')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t('vehicle.condition')}</h3>
                <p>{vehicle.condition}</p>
              </div>
            </div>

            <button
              onClick={handleButtonClick}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              {isTradeInPage || vehicle.isTradeIn ? t('vehicle.sendForTradeIn') : t('vehicle.scheduleTestDrive')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}