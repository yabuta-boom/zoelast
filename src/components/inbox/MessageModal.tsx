import React, { useState, useCallback } from 'react';
import { X, Plus, Save, ArrowRight, Upload, Trash2 } from 'lucide-react';
import { Message, CarSubmission } from '../../contexts/MessageContext';
import { collection, addDoc } from 'firebase/firestore';
import { useFirebase } from '../FirebaseProvider';

interface MessageModalProps {
  message: Message;
  onClose: () => void;
  onAddToInventory?: (submission: CarSubmission) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  message,
  onClose,
  onAddToInventory,
}) => {
  const isCarSubmission = message.type === 'car';
  const carSubmission = message as CarSubmission;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(carSubmission);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: name === 'carYear' || name === 'mileage' || name === 'price' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'zoe_car_images');
        formData.append('folder', 'zoe_car_images');

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dznucv93w/image/upload',
          {
            method: 'POST',
            body: formData
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed: ' + await response.text());
        }

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }

      setEditedData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const handleDeleteImage = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (editedData.images.length === 0) {
        throw new Error('Please provide at least one image');
      }

      // Create vehicle document in Firestore
      const vehicleData = {
        name: `${editedData.carYear} ${editedData.carMake} ${editedData.carModel}`,
        make: editedData.carMake,
        model: editedData.carModel,
        year: editedData.carYear,
        price: editedData.price || 0,
        mileage: editedData.mileage,
        body: editedData.body,
        transmission: editedData.transmission,
        engine: editedData.engine,
        exterior: editedData.exterior,
        interior: editedData.interior,
        description: editedData.description,
        images: editedData.images,
        features: [],
        condition: 'used',
        sold: false,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
      
      if (onAddToInventory) {
        onAddToInventory(editedData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding vehicle to inventory:', error);
      alert('Failed to add vehicle to inventory. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Vehicle Submission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">From</h3>
              <p className="mt-1">{message.name}</p>
              <p className="text-gray-600">{message.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1">
                {new Date(message.date).toLocaleDateString()}{' '}
                {new Date(message.date).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {isCarSubmission && (
            <>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Vehicle Details</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Edit Details
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Make
                        </label>
                        <input
                          type="text"
                          name="carMake"
                          value={editedData.carMake}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model
                        </label>
                        <input
                          type="text"
                          name="carModel"
                          value={editedData.carModel}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="number"
                          name="carYear"
                          value={editedData.carYear}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editedData.price || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Body Style
                        </label>
                        <input
                          type="text"
                          name="body"
                          value={editedData.body}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mileage
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          value={editedData.mileage}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transmission
                        </label>
                        <input
                          type="text"
                          name="transmission"
                          value={editedData.transmission}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Engine
                        </label>
                        <input
                          type="text"
                          name="engine"
                          value={editedData.engine}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exterior Color
                        </label>
                        <input
                          type="text"
                          name="exterior"
                          value={editedData.exterior}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interior Color
                        </label>
                        <input
                          type="text"
                          name="interior"
                          value={editedData.interior}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Make</h4>
                        <p>{carSubmission.carMake}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Model</h4>
                        <p>{carSubmission.carModel}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Year</h4>
                        <p>{carSubmission.carYear}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Price</h4>
                        <p>{editedData.price ? `$${editedData.price.toLocaleString()}` : 'Not set'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Body</h4>
                        <p>{carSubmission.body}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Mileage</h4>
                        <p>{carSubmission.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Transmission
                        </h4>
                        <p>{carSubmission.transmission}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Engine</h4>
                        <p>{carSubmission.engine}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Exterior Color
                        </h4>
                        <p>{carSubmission.exterior}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Interior Color
                        </h4>
                        <p>{carSubmission.interior}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editedData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <label className="relative flex flex-col items-center justify-center aspect-w-16 aspect-h-9 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                      ) : (
                        <>
                          <Upload size={24} className="text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload More Images</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editedData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save & Add to Inventory
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Description</h3>
                    <p className="whitespace-pre-wrap">{carSubmission.description}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      Review & Add to Inventory
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;