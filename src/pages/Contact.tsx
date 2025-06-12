import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { useAuth } from '../components/auth/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Phone, Mail, Clock, LogIn } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

interface LocationState {
  vehicleDetails?: {
    name: string;
    year: number;
    make: string;
    model: string;
    vin: string;
    stockNumber: string;
  };
}

const Contact: React.FC = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { db } = useFirebase();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleDetails } = (location.state as LocationState) || {};

  // Pre-fill message if vehicle details are provided
  useState(() => {
    if (vehicleDetails) {
      const vehicleMessage = `I am interested in the ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model} (VIN: ${vehicleDetails.vin}, Stock #: ${vehicleDetails.stockNumber}).`;
      setValue('message', vehicleMessage);
    }
  }, [vehicleDetails, setValue]);

  const onSubmit = async (data) => {
    if (!user) {
      setSubmitStatus('auth-required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Add message to contact_messages collection
      await addDoc(collection(db, 'contact_messages'), {
        ...data,
        userId: user.uid,
        createdAt: new Date()
      });

      // Add message to user's chat_messages
      await addDoc(collection(db, `users/${user.uid}/chat_messages`), {
        text: data.message,
        userId: user.uid,
        userName: user.displayName || data.name,
        createdAt: new Date()
      });

      setSubmitStatus('success');
      reset();
      
      // Navigate to chat page after successful submission
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-24">
      {/* Blue Banner Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-lg">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto responsive-section py-8 sm:py-12">
        <div className="responsive-grid-2 gap-8 mb-8 sm:mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
            {!user && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-gray-600 mb-4">{t('contact.form.loginRequired')}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogIn size={20} />
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {t('common.register')}
                  </button>
                </div>
              </div>
            )}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                {t('contact.form.success')}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {t('contact.form.error')}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  {t('contact.form.name')} *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="text"
                  placeholder="Your name"
                  disabled={!user}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  {t('contact.form.email')}
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type="email"
                  placeholder="Your email"
                  disabled={!user}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  {t('contact.form.phone')}
                </label>
                <input
                  {...register('phone')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="tel"
                  placeholder="Your phone number"
                  disabled={!user}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your message"
                  disabled={!user}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs italic">{errors.message.message}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                type="submit"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-600">kirkos</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-600">0907082821</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-gray-600">info@zoecardealership.com.et</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">{t('contact.hours.title')}</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('contact.hours.weekdays')}
                  </span>
                  <span className="text-gray-900 font-semibold">Local 2:00 - 11:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('contact.hours.saturday')}
                  </span>
                  <span className="text-gray-900 font-semibold">Local 2:00 - 1:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('contact.hours.sunday')}
                  </span>
                  <span className="text-gray-900 font-semibold">{t('contact.hours.closed')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Contact;