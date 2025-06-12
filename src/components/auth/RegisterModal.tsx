import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { X, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        phone,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await auth.signOut();
      
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } catch (err) {
      setError(t('register.error') || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">{t('common.register') || 'Register'}</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            {t('register.success') || 'Account created successfully! You can now log in.'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 mb-2">
                {t('register.firstName') || 'First Name'}
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 mb-2">
                {t('register.lastName') || 'Last Name'}
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              {t('contact.form.phone') || 'Phone Number'}
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-6">
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
                minLength={6}
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

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (t('register.creating') || 'Creating account...') : (t('common.register') || 'Register')}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {t('register.hasAccount') || 'Already have an account?'}{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('nav.login') || 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;