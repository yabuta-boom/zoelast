import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import { DollarSign, Package, Users, Clock } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const Overview: React.FC = () => {
  const { db } = useFirebase();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    pendingServices: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = Timestamp.now();
        const thirtyDaysAgo = new Timestamp(
          now.seconds - 30 * 24 * 60 * 60,
          now.nanoseconds
        );

        // Fetch total sales
        const salesQuery = query(
          collection(db, 'sales'),
          where('date', '>=', thirtyDaysAgo)
        );
        const salesSnapshot = await getDocs(salesQuery);
        const totalSales = salesSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        );

        // Fetch vehicles count
        const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
        
        // Fetch customers count
        const customersSnapshot = await getDocs(collection(db, 'users'));
        
        // Fetch pending services
        const servicesQuery = query(
          collection(db, 'services'),
          where('status', '==', 'pending')
        );
        const servicesSnapshot = await getDocs(servicesQuery);

        setStats({
          totalSales,
          totalVehicles: vehiclesSnapshot.size,
          totalCustomers: customersSnapshot.size,
          pendingServices: servicesSnapshot.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [db]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats_cards = [
    {
      title: 'Total Sales (30d)',
      value: formatCurrency(stats.totalSales),
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Vehicles in Stock',
      value: stats.totalVehicles,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Services',
      value: stats.pendingServices,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="h-full pt-6">
      <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats_cards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Add recent activity items here */}
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;