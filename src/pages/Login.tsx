import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../components/auth/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

const Login: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const state = location.state as any;
      if (state?.from) {
        navigate(state.from, { state: state });
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, location.state]);

  const handleClose = () => {
    const state = location.state as any;
    if (state?.from) {
      navigate(state.from);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <img 
                src="https://res.cloudinary.com/dznucv93w/image/upload/v1747405288/logo_e2go6j.png" 
                alt="Zoe Car Dealership Logo" 
                className="h-8 w-8"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{t('login.welcomeBack') || 'Welcome Back'}</h2>
          <p className="mt-2 text-blue-100">{t('login.signInAccess') || 'Sign in to access all features'}</p>
        </div>

        {showLoginModal && (
          <LoginModal
            onClose={handleClose}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}

        {showRegisterModal && (
          <RegisterModal
            onClose={handleClose}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;