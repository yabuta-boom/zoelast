import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import { useAuth } from '../../components/auth/AuthContext';
import VehicleCard from '../../components/VehicleCard';
import { Heart } from 'lucide-react';

const LikedVehicles = () => {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVehicles = async () => {
      if (!user) return;

      try {
        const likedRef = collection(db, `users/${user.uid}/liked_vehicles`);
        const querySnapshot = await getDocs(likedRef);
        
        const vehiclePromises = querySnapshot.docs.map(async (doc) => {
          const vehicleRef = doc.data().vehicleRef;
          const vehicleDoc = await getDocs(vehicleRef);
          return { id: vehicleDoc.id, ...vehicleDoc.data() };
        });

        const likedVehicles = await Promise.all(vehiclePromises);
        setVehicles(likedVehicles);
      } catch (error) {
        console.error('Error fetching liked vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVehicles();
  }, [user, db]);

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
        <Heart className="text-red-500" size={24} />
        <h1 className="text-3xl font-bold">Liked Vehicles</h1>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">You haven't liked any vehicles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVehicles;