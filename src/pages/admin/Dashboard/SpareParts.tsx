import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import { Plus, Eye, Edit, Trash2, Filter, Download, MoreHorizontal, FileText, Share2, Archive } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { utils, writeFile } from 'xlsx';
import AddSparePartForm from '../../../components/dashboard/AddSparePartForm';

interface SparePart {
  id: string;
  name: string;
  brand: string;
  category: string;
  partNumber: string;
  condition: string;
  price: number;
  stock: number;
  description: string;
  compatibility: string[];
  images: string[];
  warranty: string;
  createdAt: any;
}

const SpareParts: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { db } = useFirebase();
  const pageSize = 10;

  const fetchSpareParts = async () => {
    try {
      const sparePartsQuery = query(
        collection(db, 'spare_parts'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(sparePartsQuery);
      const sparePartsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SparePart[];
      setSpareParts(sparePartsList);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      setError('Failed to load spare parts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, [db]);

  const filteredParts = spareParts.filter(part => {
    const matchesSearch = 
      searchQuery === '' || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'in_stock' && part.stock > 0) ||
      (selectedStatus === 'out_of_stock' && part.stock === 0);
    
    return matchesSearch && matchesStatus;
  });

  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeletePart = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'spare_parts', id));
      setShowDeleteConfirm(null);
      setSpareParts(prev => prev.filter(part => part.id !== id));
    } catch (error) {
      console.error('Error deleting spare part:', error);
    }
  };

  const handleExport = () => {
    const exportData = filteredParts.map(part => ({
      'Part Name': part.name,
      'Brand': part.brand,
      'Category': part.category,
      'Part Number': part.partNumber,
      'Condition': part.condition,
      'Price': part.price,
      'Stock': part.stock,
      'Warranty': part.warranty,
      'Added Date': part.createdAt.toDate().toLocaleDateString()
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Spare Parts');
    writeFile(wb, `spare-parts-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleGenerateReport = () => {
    const reportData = {
      totalParts: filteredParts.length,
      inStock: filteredParts.filter(p => p.stock > 0).length,
      outOfStock: filteredParts.filter(p => p.stock === 0).length,
      totalValue: filteredParts.reduce((sum, p) => sum + (p.price * p.stock), 0)
    };

    const ws = utils.json_to_sheet([{
      'Total Parts': reportData.totalParts,
      'In Stock': reportData.inStock,
      'Out of Stock': reportData.outOfStock,
      'Total Inventory Value': formatCurrency(reportData.totalValue)
    }]);
    
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Spare Parts Report');
    writeFile(wb, `spare-parts-report-${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h2 className="text-2xl font-bold">Spare Parts Management</h2>
          <p className="text-gray-600">Manage your spare parts inventory</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" />
          Add New Part
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
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search parts..."
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
                        // TODO: Implement share functionality
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 size={16} className="mr-2" />
                      Share Inventory
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // TODO: Implement archive functionality
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

      {/* Parts table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
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
              {paginatedParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={part.images[0] || 'https://via.placeholder.com/150'}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-sm text-gray-500">{part.partNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{part.category}</div>
                    <div className="text-sm text-gray-500">{part.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(part.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        part.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {part.stock > 0 ? `${part.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {part.createdAt.toDate().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {}} // TODO: Implement view details
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {}} // TODO: Implement edit
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(part.id)}
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
              disabled={currentPage * pageSize >= filteredParts.length}
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
                  {Math.min((currentPage - 1) * pageSize + 1, filteredParts.length)}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredParts.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredParts.length}</span>{' '}
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
                {Array.from({ length: Math.ceil(filteredParts.length / pageSize) }).map((_, index) => (
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
                  disabled={currentPage * pageSize >= filteredParts.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this spare part? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePart(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddSparePartForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchSpareParts();
          }}
        />
      )}
    </div>
  );
};

export default SpareParts;