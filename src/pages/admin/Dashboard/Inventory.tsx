import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import { Plus, Eye, Edit, Trash2, Filter, Download, MoreHorizontal, FileText, Share2, Archive } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import AddVehicleForm from './AddVehicleForm';
import EditVehicleForm from './EditVehicleForm';
import { utils, writeFile } from 'xlsx';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  body: string;
  mileage: number;
  fuelEconomy: {
    hwy: string;
    city: string;
  };
  exterior: string;
  interior: string;
  engine: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  vin: string;
  stockNumber: string;
  doors: number;
  passengers: number;
  condition: string;
  description: string;
  images: string[];
  features: string[];
  sold: boolean;
  createdAt: any;
  status: 'in_stock' | 'reserved' | 'sold' | 'in_transit';
}

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Vehicle Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicle.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Make:</dt>
                  <dd className="font-medium">{vehicle.make}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Model:</dt>
                  <dd className="font-medium">{vehicle.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Year:</dt>
                  <dd className="font-medium">{vehicle.year}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Price:</dt>
                  <dd className="font-medium">{formatCurrency(vehicle.price)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Mileage:</dt>
                  <dd className="font-medium">{vehicle.mileage.toLocaleString()} miles</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">VIN:</dt>
                  <dd className="font-medium">{vehicle.vin}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Exterior:</dt>
                  <dd className="font-medium">{vehicle.exterior}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fuel Type:</dt>
                  <dd className="font-medium">{vehicle.fuelType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Transmission:</dt>
                  <dd className="font-medium capitalize">{vehicle.transmission}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Condition:</dt>
                  <dd className="font-medium capitalize">{vehicle.condition}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Status:</dt>
                  <dd className="font-medium capitalize">{vehicle.sold ? 'Sold' : 'Available'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Added:</dt>
                  <dd className="font-medium">{vehicle.createdAt.toDate().toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{vehicle.description}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { db } = useFirebase();
  const pageSize = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(vehiclesQuery);
      const vehicleList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        images: doc.data().images || [],
        features: doc.data().features || []
      })) as Vehicle[];
      setVehicles(vehicleList);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      searchQuery === '' || 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'sold' && vehicle.sold) ||
      (selectedStatus === 'in_stock' && !vehicle.sold);
    
    return matchesSearch && matchesStatus;
  });

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      await fetchVehicles();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleToggleSold = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'vehicles', id), {
        sold: !currentStatus
      });
      await fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  const handleExport = () => {
    const exportData = filteredVehicles.map(vehicle => ({
      'Vehicle Name': vehicle.name,
      'Price': vehicle.price,
      'Year': vehicle.year,
      'Mileage': vehicle.mileage,
      'VIN': vehicle.vin,
      'Stock Number': vehicle.stockNumber,
      'Status': vehicle.sold ? 'Sold' : 'Available',
      'Condition': vehicle.condition,
      'Added Date': vehicle.createdAt.toDate().toLocaleDateString()
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Inventory');

    writeFile(wb, `inventory-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleGenerateReport = () => {
    const reportData = {
      totalVehicles: filteredVehicles.length,
      availableVehicles: filteredVehicles.filter(v => !v.sold).length,
      soldVehicles: filteredVehicles.filter(v => v.sold).length,
      totalValue: filteredVehicles.reduce((sum, v) => sum + v.price, 0)
    };

    const ws = utils.json_to_sheet([{
      'Total Vehicles': reportData.totalVehicles,
      'Available Vehicles': reportData.availableVehicles,
      'Sold Vehicles': reportData.soldVehicles,
      'Total Inventory Value': formatCurrency(reportData.totalValue)
    }]);
    
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Inventory Report');

    writeFile(wb, `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleShareInventory = () => {
    const shareData = {
      title: 'Zoe Car Dealership Inventory',
      text: 'Check out our current inventory',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying link:', error));
    }
  };

  const handleArchiveSelected = () => {
    alert('Archive functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Manage your vehicle inventory</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add New Vehicle
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MoreHorizontal size={16} className="mr-2" />
                More
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleGenerateReport();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText size={16} className="mr-2" />
                      Generate Report
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleShareInventory();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 size={16} className="mr-2" />
                      Share Inventory
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleArchiveSelected();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Archive size={16} className="mr-2" />
                      Archive Selected
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={vehicle.images[0] || 'https://via.placeholder.com/150'}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.vin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(vehicle.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicle.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.sold
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {vehicle.sold ? 'Sold' : 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.createdAt.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setViewingVehicle(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setShowEditForm(vehicle)}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(vehicle.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * pageSize >= filteredVehicles.length}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * pageSize + 1, filteredVehicles.length)}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredVehicles.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredVehicles.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil(filteredVehicles.length / pageSize) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= filteredVehicles.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Vehicle</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <AddVehicleForm
                onSuccess={() => {
                  setShowAddForm(false);
                  fetchVehicles();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Vehicle</h2>
                <button
                  onClick={() => setShowEditForm(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <EditVehicleForm
                vehicle={showEditForm}
                onClose={() => setShowEditForm(null)}
                onSuccess={() => {
                  setShowEditForm(null);
                  fetchVehicles();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Vehicle Details Modal */}
      {viewingVehicle && (
        <VehicleDetailsModal
          vehicle={viewingVehicle}
          onClose={() => setViewingVehicle(null)}
        />
      )}
    </div>
  );
};

export default Inventory;