import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      
      // Handle redirect after successful login
      const state = location.state as any;
      if (state?.from) {
        // If there's a specific page to redirect to, go there
        navigate(state.from, { state: state });
      } else {
        // Default redirect to home
        navigate('/');
      }
      
      onClose();
    } catch (err) {
      setError(t('login.error') || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            {t('contact.form.email') || 'Email'}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            {t('login.password') || 'Password'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">
              {t('login.rememberMe') || 'Remember me'}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (t('login.loggingIn') || 'Logging in...') : (t('nav.login') || 'Login')}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        {t('login.noAccount') || "Don't have an account?"}{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-800"
        >
          {t('common.register') || 'Register'}
        </button>
      </p>
    </div>
  );
};

export default LoginModal;