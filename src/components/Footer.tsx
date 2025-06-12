import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <img 
                src="https://res.cloudinary.com/dznucv93w/image/upload/v1747407289/logo1_gsqdy6.png" 
                alt="Zoe Car Dealership Logo" 
                className="h-6 w-auto"
              />
              <span>Zoe Car Dealership</span>
            </Link>
            <p className="mb-4">
              Premium vehicles with exceptional service. Your trusted partner in finding the perfect car.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/15YY3wVsWd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://t.me/zoecardealership" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Join our Telegram channel"
              >
                {/* Telegram Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.686-2.965 7.686-.896 0-1.507-.896-1.507-.896s-4.584-3.724-5.054-4.085c-.423-.32-.634-.667-.634-1.142 0-.475.211-.823.634-1.142l10.55-7.686c.423-.32.896-.213.896.427 0 .64-.423 1.355-.423 1.355l-2.601 7.259s-.211.64-.634.64-.634-.64-.634-.64l-1.268-4.724s-.211-.64.211-.64.634.211.634.211l8.525-5.827c.423-.32.896-.213.896.427z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@Zoecardealership" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/search?q=zoe%20car%20dealership" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Find us on TikTok"
              >
                {/* TikTok Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-white transition-colors">{t('nav.inventory')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.ourServices')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/inventory" className="hover:text-white transition-colors">{t('footer.newVehicles')}</Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-white transition-colors">{t('footer.preOwnedVehicles')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('footer.financingOptions')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('footer.vehicleTradeIn')}</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>Kirkos</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="flex-shrink-0" />
                    <span>0907082821</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Phone size={20} className="flex-shrink-0" />
                    <span>0985412112</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Phone size={20} className="flex-shrink-0" />
                    <span>0912635049</span>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0" />
                <span>info@zoecardealership.com.et</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Zoe Car Dealership. {t('footer.allRightsReserved')}</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;