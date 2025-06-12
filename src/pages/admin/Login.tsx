import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { auth } from '../../firebase/config';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('yeabseramekbeb@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="mt-2 text-blue-100">Sign in to access the admin dashboard</p>
        </div>
        
        <div className="px-6 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1">
              <img 
                src="https://res.cloudinary.com/dznucv93w/image/upload/v1747405288/logo_e2go6j.png" 
                alt="Zoe Car Dealership Logo" 
                className="h-4 w-auto"
              />
              <span>Back to Zoe Car Dealership</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;