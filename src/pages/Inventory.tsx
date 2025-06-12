import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, BarChart3 } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../components/auth/AuthContext';
import { useFirebase } from '../components/FirebaseProvider';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import VehicleCard from '../components/VehicleCard';
import VehicleComparison from '../components/VehicleComparison';

const Inventory: React.FC = () => {
  const [filters, setFilters] = useState({
    model: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    isTradeIn: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedVehicles, setSavedVehicles] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const carsPerPage = 6;

  const { vehicles: filteredInventory, loading, error } = useVehicles(filters);
  const { user } = useAuth();
  const { db } = useFirebase();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSavedVehicles = async () => {
      if (!user) {
        setSavedVehicles([]);
        return;
      }

      try {
        const savedRef = collection(db, `users/${user.uid}/saved_vehicles`);
        const snapshot = await getDocs(savedRef);
        setSavedVehicles(snapshot.docs.map(doc => doc.id));
      } catch (error) {
        console.error('Error fetching saved vehicles:', error);
      }
    };

    fetchSavedVehicles();
  }, [user, db]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredInventory.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredInventory.length / carsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      model: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      isTradeIn: false
    });
    setCurrentPage(1);
  };

  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="relative bg-blue-600 text-white py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              {t('inventory.title')}
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 max-w-3xl mx-auto leading-relaxed">
              {t('inventory.subtitle')}
            </p>
            {filteredInventory.length > 2 && (
              <button
                onClick={() => setShowComparison(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                <BarChart3 size={20} />
                Compare Vehicles
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.filters.model')}
              </label>
              <select
                id="model"
                name="model"
                value={filters.model}
                onChange={handleInputChange}
                className="p-3 border rounded w-48"
              >
                <option value="">{t('inventory.filters.allModels')}</option>
                {[...new Set(filteredInventory.map(car => car.name))].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                {t('inventory.filters.year')}
              </label>
              <select
                id="year"
                name="year"
                value={filters.year}
                onChange={handleInputChange}
                className="p-3 border rounded w-48"
              >
                <option value="">{t('inventory.filters.allYears')}</option>
                {[...new Set(filteredInventory.map(car => car.year))].map(year => (
                  <option key={year} value={year}>{year}</option>
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

      {/* Inventory Grid */}
      <section className="py-8 sm:py-16 px-2 sm:px-4 bg-white">
        <div className="container mx-auto responsive-section">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {t('common.tryAgain')}
              </button>
            </div>
          ) : (
            <div className="responsive-grid-3">
              {currentCars.map((car) => (
                <VehicleCard 
                  key={car.id} 
                  vehicle={car}
                  isSaved={savedVehicles.includes(car.id)}
                  onSaveToggle={() => {
                    setSavedVehicles(prev => 
                      prev.includes(car.id)
                        ? prev.filter(id => id !== car.id)
                        : [...prev, car.id]
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {!loading && !error && filteredInventory.length > 0 && (
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

      {/* Vehicle Comparison Modal */}
      {showComparison && (
        <VehicleComparison
          vehicles={filteredInventory}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default Inventory;