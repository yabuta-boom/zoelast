import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, BookmarkCheck, MoreVertical, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, unreadCount } = useAuth();
  const { t } = useLanguage();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const isHomePage = location.pathname === '/';
  
  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled || !isHomePage 
      ? 'bg-white shadow-md py-4' 
      : 'bg-transparent py-6'
  }`;
  
  const linkClasses = (path: string) => `text-lg font-medium transition-colors hover:text-blue-600 relative group ${
    isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'
  } ${location.pathname === path ? 'text-blue-600' : ''}`;

  const activeLinkIndicator = `absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${
    location.pathname === '/' ? 'scale-x-100' : 'scale-x-0'
  } group-hover:scale-x-100`;
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitial = () => {
    if (!user) return '';
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || '?';
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/inventory', label: t('nav.inventory') },
    { path: '/trade-in', label: t('nav.tradeIn') },
    { path: '/spare-parts', label: t('nav.spareParts') },
    { path: '/send-us-your-car', label: t('nav.sendUsYourCar') },
    { path: '/services', label: t('nav.services') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img 
              src={isScrolled || !isHomePage 
                ? "https://res.cloudinary.com/dznucv93w/image/upload/v1747405288/logo_e2go6j.png"
                : "https://res.cloudinary.com/dznucv93w/image/upload/v1747407289/logo1_gsqdy6.png"} 
              alt="Zoe Car Dealership Logo" 
              className="h-8 w-auto"
            />
            <span className={`text-xl font-bold ${
              isScrolled || !isHomePage ? 'text-blue-600' : 'text-white'
            }`}>
              Zoe Car Dealership
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClasses(link.path)}>
                {link.label}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100`} />
              </Link>
            ))}
            {user ? (
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                      {getUserInitial()}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical size={20} className={isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'} />
                  </button>
                </div>
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                      >
                        <User size={20} />
                        {t('nav.adminDashboard')}
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        >
                          <User size={20} />
                          {t('nav.profile')}
                        </Link>
                        <Link
                          to="/saved-vehicles"
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        >
                          <BookmarkCheck size={20} />
                          {t('nav.savedVehicles')}
                        </Link>
                        <Link
                          to="/chat"
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        >
                          <MessageCircle size={20} />
                          {t('nav.messages')}
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-auto">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <LogOut size={20} />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-medium"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-800 p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? 
              <X size={28} className={isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'} /> : 
              <Menu size={28} className={isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'} />
            }
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <img 
                  src="https://res.cloudinary.com/dznucv93w/image/upload/v1747405288/logo_e2go6j.png"
                  alt="Zoe Car Dealership Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-blue-600">Zoe Car Dealership</span>
              </Link>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={28} className="text-gray-800" />
              </button>
            </div>
            <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-semibold text-gray-800 hover:text-blue-600 py-3 rounded transition-colors ${location.pathname === link.path ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-gray-800 hover:text-blue-600 py-3 text-lg"
                      >
                        <User size={24} />
                        {t('nav.adminDashboard')}
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 py-3 text-lg"
                        >
                          <User size={24} />
                          {t('nav.profile')}
                        </Link>
                        <Link
                          to="/saved-vehicles"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 py-3 text-lg"
                        >
                          <BookmarkCheck size={24} />
                          {t('nav.savedVehicles')}
                        </Link>
                        <Link
                          to="/chat"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 py-3 text-lg"
                        >
                          <MessageCircle size={24} />
                          {t('nav.messages')}
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 py-3 text-lg w-full text-left"
                    >
                      <LogOut size={24} />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-semibold text-center w-full mt-2"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;