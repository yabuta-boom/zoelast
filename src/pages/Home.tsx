import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Shield, Clock, Phone, BarChart3 } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatters';
import VehicleComparison from '../components/VehicleComparison';

const Home: React.FC = () => {
  const { vehicles: featuredVehicles, loading } = useVehicles();
  const { t } = useLanguage();
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg" 
            alt="Luxury Car Dealership"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
        
        <div className="relative h-full container mx-auto px-6 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/inventory"
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  {t('home.hero.browseCars')}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/services"
                  className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
                >
                  {t('home.hero.ourServices')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Vehicles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">{t('home.featured.title')}</h2>
            {featuredVehicles.length > 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <BarChart3 size={20} />
                Compare Vehicles
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVehicles.slice(0, 3).map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || "https://res.cloudinary.com/dznucv93w/image/upload/v1709652145/zoe_car_images/default-car_kqln7p.jpg"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 mb-4">{vehicle.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(vehicle.price)}
                      </span>
                      <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        {t('common.learnMore')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">{t('home.whyChoose.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.whyChoose.quality.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.quality.desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.whyChoose.delivery.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.delivery.desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.whyChoose.financing.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.financing.desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.whyChoose.support.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.support.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">{t('home.cta.title')}</h2>
          <p className="text-xl text-white mb-8">
            {t('home.cta.subtitle')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/inventory"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              {t('home.cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Comparison Modal */}
      {showComparison && (
        <VehicleComparison
          vehicles={featuredVehicles}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default Home;