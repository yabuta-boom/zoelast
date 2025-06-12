import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, DocumentData, Query } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  image: string;
  year: number;
  mileage: number;
  condition: string;
  features: string[];
  description: string;
  createdAt: Date;
  isTradeIn: boolean;
}

interface VehicleFilters {
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  isTradeIn?: boolean;
}

export const useVehicles = (filters: VehicleFilters = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let vehicleQuery: Query = collection(db, 'vehicles');

        // First, filter by isTradeIn
        vehicleQuery = query(
          vehicleQuery, 
          where('isTradeIn', '==', filters.isTradeIn || false)
        );

        // Apply other filters
        if (filters.model) {
          vehicleQuery = query(vehicleQuery, where('name', '>=', filters.model), where('name', '<=', filters.model + '\uf8ff'));
        }
        if (filters.year) {
          vehicleQuery = query(vehicleQuery, where('year', '==', parseInt(filters.year)));
        }
        if (filters.condition) {
          vehicleQuery = query(vehicleQuery, where('condition', '==', filters.condition));
        }
        
        // Add default ordering
        vehicleQuery = query(vehicleQuery, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(vehicleQuery);
        const vehicleList: Vehicle[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          
          // Apply price filters after fetching
          const price = data.price;
          const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : null;
          const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : null;
          
          if (
            (!minPrice || price >= minPrice) && 
            (!maxPrice || price <= maxPrice)
          ) {
            vehicleList.push({
              id: doc.id,
              ...data as Omit<Vehicle, 'id'>
            });
          }
        });
        
        setVehicles(vehicleList);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [db, JSON.stringify(filters)]);

  return { vehicles, loading, error };
};