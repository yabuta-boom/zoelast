import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="w-full pt-24">
      {/* Blue Banner Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-lg">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h2>
            <p className="text-gray-600">
              {t('about.mission.desc')}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision.title')}</h2>
            <p className="text-gray-600">
              {t('about.vision.desc')}
            </p>
          </motion.div>
        </div>

        {/* Company Stats */}
        <div className="bg-blue-600 rounded-lg p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg">{t('about.stats.customers')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg">{t('about.stats.cars')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg">{t('about.stats.staff')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6mo+</div>
              <div className="text-lg">{t('about.stats.experience')}</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('about.values.innovation')}</h3>
              <p className="text-gray-600">{t('about.values.innovation.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('about.values.trust')}</h3>
              <p className="text-gray-600">{t('about.values.trust.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('about.values.transparency')}</h3>
              <p className="text-gray-600">{t('about.values.transparency.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('about.values.excellence')}</h3>
              <p className="text-gray-600">{t('about.values.excellence.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}