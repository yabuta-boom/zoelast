import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { useFirebase } from '../components/FirebaseProvider';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import SparePartCard from '../components/SparePartCard';

interface SparePart {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  condition: string;
  compatibility: string[];
  partNumber: string;
  description: string;
  images: string[];
  stock: number;
  warranty: string;
  createdAt: any;
}

const SpareParts: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedParts, setSavedParts] = useState<string[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const partsPerPage = 6;

  const { user, isAdmin } = useAuth();
  const { db } = useFirebase();
  const { t } = useLanguage();

  useEffect(() => {
    const sparePartsRef = collection(db, 'spare_parts');
    const q = query(sparePartsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SparePart[];
        setSpareParts(parts);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching spare parts:', error);
        setError('Failed to load spare parts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const fetchSavedParts = async () => {
      if (!user) {
        setSavedParts([]);
        return;
      }

      try {
        const savedRef = collection(db, `users/${user.uid}/saved_parts`);
        const snapshot = await getDocs(savedRef);
        setSavedParts(snapshot.docs.map(doc => doc.id));
      } catch (error) {
        console.error('Error fetching saved parts:', error);
      }
    };

    fetchSavedParts();
  }, [user, db]);

  const filteredParts = spareParts.filter(part => {
    const matchesCategory = filters.category === '' || part.category === filters.category;
    const matchesBrand = filters.brand === '' || part.brand === filters.brand;
    const matchesMinPrice = filters.minPrice === '' || part.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || part.price <= parseFloat(filters.maxPrice);
    const matchesCondition = filters.condition === '' || part.condition === filters.condition;

    return matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesCondition;
  });

  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);
  const totalPages = Math.ceil(filteredParts.length / partsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      condition: ''
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="relative bg-blue-600 text-white py-12 sm:py-20 px-2 sm:px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative container mx-auto text-center responsive-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
              {t('spareParts.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              {t('spareParts.subtitle')}
            </p>
            {isAdmin && (
              <Link
                to="/admin?tab=spare-parts"
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                <Settings size={20} />
                Manage Spare Parts
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 sm:py-8 px-2 sm:px-4 bg-gray-100">
        <div className="container mx-auto responsive-section">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                {t('spareParts.filters.category')}
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="p-3 border rounded w-48"
              >
                <option value="">{t('spareParts.filters.allCategories')}</option>
                <option value="Engine">{t('spareParts.categories.engine')}</option>
                <option value="Brakes">{t('spareParts.categories.brakes')}</option>
                <option value="Suspension">{t('spareParts.categories.suspension')}</option>
                <option value="Electrical">{t('spareParts.categories.electrical')}</option>
                <option value="Body">{t('spareParts.categories.body')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                {t('spareParts.filters.brand')}
              </label>
              <select
                id="brand"
                name="brand"
                value={filters.brand}
                onChange={handleInputChange}
                className="p-3 border rounded w-48"
              >
                <option value="">{t('spareParts.filters.allBrands')}</option>
                {[...new Set(spareParts.map(part => part.brand))].map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.filters.minPrice')}
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="Min Price"
                className="p-3 border rounded w-48"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.filters.maxPrice')}
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Max Price"
                className="p-3 border rounded w-48"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.filters.condition')}
              </label>
              <select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleInputChange}
                className="p-3 border rounded w-48"
              >
                <option value="">{t('inventory.filters.allConditions')}</option>
                <option value="New">{t('inventory.filters.new')}</option>
                <option value="Used">{t('inventory.filters.used')}</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t('inventory.filters.reset')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="py-8 sm:py-16 px-2 sm:px-4 bg-white">
        <div className="container mx-auto responsive-section">
          <div className="responsive-grid-3">
            {currentParts.map((part) => (
              <SparePartCard
                key={part.id}
                part={part}
                isSaved={savedParts.includes(part.id)}
                onSaveToggle={() => {
                  setSavedParts(prev =>
                    prev.includes(part.id)
                      ? prev.filter(id => id !== part.id)
                      : [...prev, part.id]
                  );
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      {!loading && !error && filteredParts.length > 0 && (
        <section className="py-8 px-4 bg-gray-100">
          <div className="container mx-auto flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              {t('inventory.pagination.previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              {t('inventory.pagination.next')}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default SpareParts;