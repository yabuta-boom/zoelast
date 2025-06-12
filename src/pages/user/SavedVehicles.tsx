import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import { useAuth } from '../../components/auth/AuthContext';
import VehicleCard from '../../components/VehicleCard';
import { BookmarkCheck } from 'lucide-react';

const SavedVehicles = () => {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [savedVehicleIds, setSavedVehicleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedVehicles = async () => {
      if (!user) return;

      try {
        const savedRef = collection(db, `users/${user.uid}/saved_vehicles`);
        const querySnapshot = await getDocs(savedRef);
        
        const vehiclePromises = querySnapshot.docs.map(async (savedDoc) => {
          const vehicleRef = savedDoc.data().vehicleRef;
          const vehicleDoc = await getDoc(vehicleRef);
          return { id: vehicleDoc.id, ...vehicleDoc.data() };
        });

        const savedVehicles = await Promise.all(vehiclePromises);
        setVehicles(savedVehicles);
        setSavedVehicleIds(savedVehicles.map(v => v.id));
      } catch (error) {
        console.error('Error fetching saved vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVehicles();
  }, [user, db]);

  const handleSaveToggle = (vehicleId: string) => {
    setSavedVehicleIds(prev => prev.filter(id => id !== vehicleId));
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="flex items-center gap-2 mb-8">
        <BookmarkCheck className="text-blue-500" size={24} />
        <h1 className="text-3xl font-bold">Saved Vehicles</h1>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkCheck className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">You haven't saved any vehicles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
              isSaved={savedVehicleIds.includes(vehicle.id)}
              onSaveToggle={() => handleSaveToggle(vehicle.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedVehicles;