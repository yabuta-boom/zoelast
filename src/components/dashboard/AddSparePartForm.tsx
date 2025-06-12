import React, { useState, useCallback } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

interface AddSparePartFormProps {
  onSuccess?: () => void;
  onClose: () => void;
}

const AddSparePartForm: React.FC<AddSparePartFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    partNumber: '',
    condition: 'New',
    price: '',
    stock: '',
    warranty: '',
    description: '',
    compatibility: [''],
    features: ['']
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

  const handleArrayInputChange = (index: number, value: string, field: 'compatibility' | 'features') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field: 'compatibility' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index: number, field: 'compatibility' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
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
        formData.append('folder', 'zoe_spare_parts');

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

      const sparePartData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        compatibility: formData.compatibility.filter(c => c.trim() !== ''),
        features: formData.features.filter(f => f.trim() !== ''),
        images: uploadedImages,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'spare_parts'), sparePartData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add spare part');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Spare Part</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Category</option>
                  <option value="Engine">Engine Parts</option>
                  <option value="Brakes">Brake System</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body">Body Parts</option>
                  <option value="Interior">Interior</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Exhaust">Exhaust System</option>
                  <option value="Cooling">Cooling System</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Number *
                </label>
                <input
                  type="text"
                  name="partNumber"
                  required
                  value={formData.partNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETB) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 12 months"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compatible Vehicles
              </label>
              {formData.compatibility.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'compatibility')}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="e.g., Toyota Camry 2018-2022"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, 'compatibility')}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('compatibility')}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Compatible Vehicle
              </button>
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
                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'features')}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Enter a feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, 'features')}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('features')}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Feature
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Images *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Part image ${index + 1}`}
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
                Upload clear photos of the spare part.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Adding...' : 'Add Spare Part'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSparePartForm;