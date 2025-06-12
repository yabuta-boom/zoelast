import React, { useState, Suspense, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, DollarSign, Wrench, Wallet, Inbox as InboxIcon, MessageCircle, Settings, Car, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthContext';

// Import Overview component directly for initial render
import Overview from './Overview';

// Lazy load other components
const Inventory = React.lazy(() => import('./Inventory'));
const Customers = React.lazy(() => import('./Customers'));
const Sales = React.lazy(() => import('./Sales'));
const Services = React.lazy(() => import('./Services'));
const Finance = React.lazy(() => import('./Finance'));
const Inbox = React.lazy(() => import('./Inbox'));
const MessageCenter = React.lazy(() => import('./MessageCenter'));
const SpareParts = React.lazy(() => import('./SpareParts'));
const TradeIn = React.lazy(() => import('./TradeIn'));
const TradeInSubmissions = React.lazy(() => import('./TradeInSubmissions'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'overview';
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'spare-parts', label: 'Spare Parts', icon: Settings },
    { id: 'trade-in', label: 'Trade-In', icon: Car },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'inbox', label: 'Inbox', icon: InboxIcon },
    { id: 'message-center', label: 'Message Center', icon: MessageCircle },
    { id: 'trade-in-submissions', label: 'Trade-In Submissions', icon: RefreshCw },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabId);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (activeTab) {
            case 'overview':
              return <Overview />;
            case 'inventory':
              return <Inventory />;
            case 'spare-parts':
              return <SpareParts />;
            case 'trade-in':
              return <TradeIn />;
            case 'customers':
              return <Customers />;
            case 'sales':
              return <Sales />;
            case 'services':
              return <Services />;
            case 'finance':
              return <Finance />;
            case 'inbox':
              return <Inbox />;
            case 'message-center':
              return <MessageCenter />;
            case 'trade-in-submissions':
              return <TradeInSubmissions />;
            default:
              return <Overview />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="py-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;