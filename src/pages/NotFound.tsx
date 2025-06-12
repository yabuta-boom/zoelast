import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <img 
          src="https://res.cloudinary.com/dznucv93w/image/upload/v1747405288/logo_e2go6j.png" 
          alt="Zoe Car Dealership Logo" 
          className="h-16 w-auto mx-auto mb-8"
        />
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;