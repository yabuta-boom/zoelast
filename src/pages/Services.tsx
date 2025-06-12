import { motion } from 'framer-motion';
import { CheckCircle, Wallet, Shield, Wrench, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      title: t('services.inspection.title'),
      description: t('services.inspection.desc'),
      icon: <CheckCircle className="w-12 h-12 text-blue-600" />,
    },
    {
      title: t('services.financing.title'),
      description: t('services.financing.desc'),
      icon: <Wallet className="w-12 h-12 text-blue-600" />,
    },
    {
      title: t('services.insurance.title'),
      description: t('services.insurance.desc'),
      icon: <Shield className="w-12 h-12 text-blue-600" />,
    },
    {
      title: t('services.maintenance.title'),
      description: t('services.maintenance.desc'),
      icon: <Wrench className="w-12 h-12 text-blue-600" />,
    },
  ];

  return (
    <div className="w-full pt-24">
      {/* Blue Banner Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto responsive-section text-center">
          <h1 className="responsive-title font-bold mb-4">{t('services.title')}</h1>
          <p className="text-lg sm:text-xl">
            {t('services.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto responsive-section">
        <div className="responsive-grid-2 mb-8 sm:mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                {service.icon}
                <h3 className="text-xl font-semibold ml-4">{service.title}</h3>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Service Process */}
        <div className="bg-gray-50 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('services.process.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('services.process.book.title')}</h3>
              <p className="text-gray-600">{t('services.process.book.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('services.process.inspection.title')}</h3>
              <p className="text-gray-600">{t('services.process.inspection.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('services.process.execution.title')}</h3>
              <p className="text-gray-600">{t('services.process.execution.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('services.process.quality.title')}</h3>
              <p className="text-gray-600">{t('services.process.quality.desc')}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('services.cta.title')}</h2>
          <p className="text-xl text-white mb-8">
            {t('services.cta.subtitle')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 inline-flex items-center gap-2"
            >
              <Phone size={20} />
              <span>{t('services.cta.button')}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}