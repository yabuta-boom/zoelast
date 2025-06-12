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
            className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative h-full container mx-auto responsive-section flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="responsive-title font-bold text-white mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/inventory"
                  className="responsive-btn bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-block"
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
                  className="responsive-btn bg-white text-gray-900 hover:bg-gray-100 transition-colors inline-block"
                >
                  {t('home.hero.ourServices')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Vehicles */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto responsive-section">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
            <h2 className="responsive-title font-bold">{t('home.featured.title')}</h2>
            {featuredVehicles.length > 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors responsive-btn"
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
            <div className="responsive-grid-3">
              {featuredVehicles.slice(0, 3).map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden responsive-card"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || 'https://res.cloudinary.com/dznucv93w/image/upload/v1709652145/zoe_car_images/default-car_kqln7p.jpg'}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{vehicle.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{vehicle.description}</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">
                        {formatCurrency(vehicle.price)}
                      </span>
                      <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="responsive-btn bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto responsive-section">
          <h2 className="responsive-title text-center mb-8 sm:mb-12">{t('home.whyChoose.title')}</h2>
          <div className="responsive-grid-4">
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
      <section className="py-12 sm:py-20 bg-blue-600">
        <div className="container mx-auto responsive-section text-center">
          <h2 className="responsive-title text-white mb-4 sm:mb-8">{t('home.cta.title')}</h2>
          <p className="text-lg sm:text-xl text-white mb-4 sm:mb-8">
            {t('home.cta.subtitle')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/inventory"
              className="responsive-btn bg-white text-blue-600 hover:bg-gray-100 transition-colors inline-block"
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