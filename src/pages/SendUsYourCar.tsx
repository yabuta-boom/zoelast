import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CarSubmissionForm from '../components/forms/CarSubmissionForm';

interface LocationState {
  vehicleId?: string;
  vehicleName?: string;
  sourcePage?: 'trade-in' | 'send-us-your-car';
}

const SendUsYourCar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const locationState = location.state as LocationState;
  
  // Determine if this is a trade-in submission based on location state or URL
  const isTradeIn = locationState?.sourcePage === 'trade-in' || 
                   window.location.search.includes('trade-in');
  
  const sourcePage = isTradeIn ? 'trade-in' : 'send-us-your-car';

  return (
    <div className="w-full pt-24">
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://res.cloudinary.com/dznucv93w/image/upload/v1747407289/logo1_gsqdy6.png" 
              alt="Zoe Car Dealership Logo" 
              className="h-16 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">
              {isTradeIn ? t('sendCar.tradeInTitle') : t('sendCar.title')}
            </h1>
            <p className="text-lg">
              {isTradeIn ? t('sendCar.tradeInSubtitle') : t('sendCar.subtitle')}
            </p>
            {locationState?.vehicleName && (
              <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                <p className="text-sm">
                  {isTradeIn ? 'Trading in for:' : 'Interested in:'} <strong>{locationState.vehicleName}</strong>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <CarSubmissionForm 
            sourcePage={sourcePage}
            selectedCarId={locationState?.vehicleId}
          />
        </div>
      </div>
    </div>
  );
};

export default SendUsYourCar;