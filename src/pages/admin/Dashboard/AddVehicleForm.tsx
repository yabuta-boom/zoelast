import React, { useState, useCallback } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useFirebase } from '../../../components/FirebaseProvider';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

interface AddVehicleFormProps {
  onSuccess?: () => void;
  isTradeIn?: boolean;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onSuccess, isTradeIn = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    year: new Date().getFullYear().toString(),
    mileage: '',
    condition: 'New',
    features: [''],
    description: '',
    make: '',
    model: '',
    bodyType: '',
    body: '',
    exterior: '',
    interior: '',
    engine: '',
    transmission: '',
    driveType: '',
    fuelType: '',
    vin: '',
    stockNumber: '',
    doors: '',
    passengers: '',
    sold: false,
    isTradeIn: isTradeIn
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
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

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  }, []);

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (uploadedImages.length === 0) {
        throw new Error('Please upload at least one image');
      }

      const vehicleData = {
        name: formData.name,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        condition: formData.condition,
        features: formData.features.filter(f => f.trim() !== ''),
        description: formData.description,
        images: uploadedImages,
        make: formData.make,
        model: formData.model,
        bodyType: formData.bodyType,
        body: formData.body,
        exterior: formData.exterior,
        interior: formData.interior,
        engine: formData.engine,
        transmission: formData.transmission,
        driveType: formData.driveType,
        fuelType: formData.fuelType,
        vin: formData.vin,
        stockNumber: formData.stockNumber,
        doors: parseInt(formData.doors),
        passengers: parseInt(formData.passengers),
        sold: formData.sold,
        isTradeIn: isTradeIn,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'vehicles'), vehicleData);
      
      setFormData({
        name: '',
        price: '',
        year: new Date().getFullYear().toString(),
        mileage: '',
        condition: 'New',
        features: [''],
        description: '',
        make: '',
        model: '',
        bodyType: '',
        body: '',
        exterior: '',
        interior: '',
        engine: '',
        transmission: '',
        driveType: '',
        fuelType: '',
        vin: '',
        stockNumber: '',
        doors: '',
        passengers: '',
        sold: false,
        isTradeIn: isTradeIn
      });
      setUploadedImages([]);

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            required
            value={formData.make}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            required
            value={formData.model}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
            Body Type
          </label>
          <input
            type="text"
            id="bodyType"
            name="bodyType"
            required
            value={formData.bodyType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
            Mileage
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            required
            min="0"
            value={formData.mileage}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            required
            value={formData.condition}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Body Style
          </label>
          <input
            type="text"
            id="body"
            name="body"
            required
            value={formData.body}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="exterior" className="block text-sm font-medium text-gray-700 mb-1">
            Exterior Color
          </label>
          <input
            type="text"
            id="exterior"
            name="exterior"
            required
            value={formData.exterior}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="interior" className="block text-sm font-medium text-gray-700 mb-1">
            Interior Color
          </label>
          <input
            type="text"
            id="interior"
            name="interior"
            required
            value={formData.interior}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-1">
            Engine
          </label>
          <input
            type="text"
            id="engine"
            name="engine"
            required
            value={formData.engine}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <input
            type="text"
            id="transmission"
            name="transmission"
            required
            value={formData.transmission}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="driveType" className="block text-sm font-medium text-gray-700 mb-1">
            Drive Type
          </label>
          <input
            type="text"
            id="driveType"
            name="driveType"
            required
            value={formData.driveType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <input
            type="text"
            id="fuelType"
            name="fuelType"
            required
            value={formData.fuelType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
            VIN
          </label>
          <input
            type="text"
            id="vin"
            name="vin"
            required
            value={formData.vin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="stockNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Number
          </label>
          <input
            type="text"
            id="stockNumber"
            name="stockNumber"
            required
            value={formData.stockNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Doors
          </label>
          <input
            type="number"
            id="doors"
            name="doors"
            required
            min="1"
            value={formData.doors}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Passengers
          </label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            required
            min="1"
            value={formData.passengers}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a feature"
            />
            <button
              type="button"
              onClick={() => removeFeatureField(index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeatureField}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Feature
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Vehicle Images *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Vehicle image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
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
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload Photos</span>
              </>
            )}
          </label>
        </div>
        <p className="text-sm text-gray-500">
          Upload clear photos of the vehicle. Include exterior and interior shots.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sold"
          name="sold"
          checked={formData.sold}
          onChange={(e) => setFormData(prev => ({ ...prev, sold: e.target.checked }))}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="sold" className="text-sm font-medium text-gray-700">
          Mark as Sold
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || uploadingImages}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
      </button>
    </form>
  );
};

export default AddVehicleForm;