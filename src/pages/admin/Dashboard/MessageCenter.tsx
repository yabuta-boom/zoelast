import React, { useState } from 'react';
import { Car, Eye, Trash2, Download, Image as ImageIcon } from 'lucide-react';
import DataTable from '../../../components/dashboard/DataTable';
import MessageModal from '../../../components/inbox/MessageModal';
import { useMessages, Message, CarSubmission } from '../../../contexts/MessageContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';

const MessageCenter: React.FC = () => {
  const { messages, markAsRead, deleteMessage, exportMessages } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const navigate = useNavigate();
  const { db } = useFirebase();
  const pageSize = 10;

  // Filter only regular car submissions (not trade-in)
  const filteredMessages = messages.filter(
    (message) =>
      message.type === 'car' &&
      (message as CarSubmission).submissionType === 'regular' &&
      (searchQuery === '' ||
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message as CarSubmission).carMake?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message as CarSubmission).carModel?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalItems = filteredMessages.length;
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewMessage = (message: Message) => {
    markAsRead(message.id);
    setSelectedMessage(message);
  };

  const handleDeleteMessage = (message: Message) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteMessage(message.id);
    }
  };

  const handleAddToInventory = async (carSubmission: CarSubmission) => {
    try {
      // Create vehicle document in Firestore
      const vehicleData = {
        name: `${carSubmission.carYear} ${carSubmission.carMake} ${carSubmission.carModel}`,
        make: carSubmission.carMake,
        model: carSubmission.carModel,
        year: carSubmission.carYear,
        price: 0, // This will be set by admin later
        mileage: carSubmission.mileage,
        body: carSubmission.body,
        transmission: carSubmission.transmission,
        engine: carSubmission.engine,
        exterior: carSubmission.exterior,
        interior: carSubmission.interior,
        description: carSubmission.description,
        images: carSubmission.images || [],
        features: [],
        condition: 'used',
        sold: false,
        isTradeIn: false, // Mark as regular vehicle
        createdAt: new Date()
      };

      await addDoc(collection(db, 'vehicles'), vehicleData);
      
      // Close the modal and navigate to inventory
      setSelectedMessage(null);
      navigate('/admin?tab=inventory');
    } catch (error) {
      console.error('Error adding to inventory:', error);
      alert('Failed to add vehicle to inventory. Please try again.');
    }
  };

  const renderActions = (message: Message) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleViewMessage(message)}
        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
        title="View details"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => handleDeleteMessage(message)}
        className="p-1 rounded-full text-red-600 hover:bg-red-100"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Car Submissions</h1>
        <p className="text-gray-600">Review and manage regular car submissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, email, make, or model"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
        />
        <button
          onClick={exportMessages}
          className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Car Submissions</h3>
          <p className="text-gray-600">No regular car submissions have been received yet.</p>
        </div>
      ) : (
        <DataTable
          data={paginatedMessages}
          keyExtractor={(message) => message.id}
          searchable
          onSearch={handleSearch}
          pagination={{
            pageSize,
            totalItems,
            currentPage,
            onPageChange: handlePageChange,
          }}
          columns={[
            {
              key: 'type',
              header: 'Type',
              render: () => (
                <div className="flex items-center">
                  <Car size={16} className="text-green-500" />
                  <span className="ml-2">Car Submission</span>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (message) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.read
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {message.read ? 'Read' : 'Unread'}
                </span>
              ),
            },
            {
              key: 'name',
              header: 'From',
              render: (message) => (
                <div>
                  <div className="font-medium text-gray-900">{message.name}</div>
                  <div className="text-gray-500 text-sm">{message.email}</div>
                </div>
              ),
              sortable: true,
            },
            {
              key: 'details',
              header: 'Vehicle',
              render: (message) => {
                const car = message as CarSubmission;
                return (
                  <div>
                    <div className="font-medium">
                      {car.carYear} {car.carMake} {car.carModel}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {car.mileage.toLocaleString()} miles • {car.transmission}
                    </div>
                  </div>
                );
              },
            },
            {
              key: 'attachments',
              header: 'Images',
              render: (message) => {
                const car = message as CarSubmission;
                return car.images?.length > 0 ? (
                  <div className="flex items-center">
                    <ImageIcon size={16} className="text-gray-400 mr-2" />
                    <span>{car.images.length} images</span>
                  </div>
                ) : (
                  <span className="text-gray-400">No images</span>
                );
              },
            },
            {
              key: 'date',
              header: 'Date',
              render: (message) => (
                <div className="text-sm text-gray-500">
                  {new Date(message.date).toLocaleDateString()}
                  <div className="text-xs">
                    {new Date(message.date).toLocaleTimeString()}
                  </div>
                </div>
              ),
              sortable: true,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: renderActions,
            },
          ]}
          actions={renderActions}
        />
      )}

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onAddToInventory={handleAddToInventory}
        />
      )}
    </div>
  );
};

export default MessageCenter;