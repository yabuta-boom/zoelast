import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../FirebaseProvider';
import { useAuth } from '../auth/AuthContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CarSubmissionFormProps {
  sourcePage: 'trade-in' | 'send-us-your-car';
  selectedCarId?: string;
  onSuccess?: () => void;
}

const CarSubmissionForm: React.FC<CarSubmissionFormProps> = ({
  sourcePage,
  selectedCarId,
  onSuccess
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebase();
  const { user } = useAuth();
  const navigate = useNavigate();

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
        formData.append('folder', 'zoe_car_submissions');

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const validateFormData = (data: any, userProfile: any) => {
    const errors: string[] = [];

    // Check required form fields
    if (!data.make?.trim()) errors.push('Car make is required');
    if (!data.model?.trim()) errors.push('Car model is required');
    if (!data.year || isNaN(parseInt(data.year))) errors.push('Valid car year is required');
    if (!data.mileage || isNaN(parseInt(data.mileage))) errors.push('Valid mileage is required');
    if (!data.condition?.trim()) errors.push('Car condition is required');

    // Check user information
    const userName = userProfile?.firstName && userProfile?.lastName 
      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
      : user?.displayName?.trim() || user?.email?.split('@')[0] || '';
    
    if (!userName) errors.push('User name is required');
    if (!user?.email?.trim()) errors.push('User email is required');

    // Check images
    if (uploadedImages.length === 0) errors.push('At least one car image is required');

    return { errors, userName };
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: sourcePage === 'trade-in' ? '/trade-in' : '/send-us-your-car',
          action: 'submit-car'
        }
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Fetch user profile data
      const userProfile = await fetchUserProfile(user.uid);
      
      // Validate all form data
      const { errors: validationErrors, userName } = validateFormData(data, userProfile);
      
      if (validationErrors.length > 0) {
        setError(`Please fix the following issues:\n• ${validationErrors.join('\n• ')}`);
        setIsSubmitting(false);
        return;
      }

      // Determine submission type based on source page
      const submissionType = sourcePage === 'trade-in' ? 'trade-in' : 'regular';
      
      // Prepare submission data with all required fields
      const submissionData = {
        // User information
        userId: user.uid,
        name: userName,
        email: user.email || '',
        phone: userProfile?.phone || '',
        
        // Car information from form
        carMake: data.make?.trim() || '',
        carModel: data.model?.trim() || '',
        carYear: parseInt(data.year) || 0,
        mileage: parseInt(data.mileage) || 0,
        condition: data.condition?.trim() || '',
        vin: data.vin?.trim() || '',
        description: data.description?.trim() || '',
        price: data.price ? parseFloat(data.price) : 0, // Add price field
        
        // Additional fields for compatibility
        make: data.make?.trim() || '',
        model: data.model?.trim() || '',
        year: parseInt(data.year) || 0,
        body: data.condition?.trim() || '',
        transmission: 'Manual', // Default value
        engine: 'Unknown', // Default value
        exterior: 'Unknown', // Default value
        interior: 'Unknown', // Default value
        
        // Submission metadata
        images: uploadedImages,
        sourcePage,
        selectedCarId: selectedCarId || '',
        submissionType,
        createdAt: new Date(),
        status: 'pending',
        read: false
      };

      // Debug log before submission
      console.log('Submitting car data:', {
        ...submissionData,
        images: `${submissionData.images.length} images`
      });

      // Validate that no fields are undefined
      const undefinedFields = Object.entries(submissionData)
        .filter(([key, value]) => value === undefined)
        .map(([key]) => key);

      if (undefinedFields.length > 0) {
        throw new Error(`The following fields are undefined: ${undefinedFields.join(', ')}`);
      }

      await addDoc(collection(db, 'car_submissions'), submissionData);
      
      reset();
      setUploadedImages([]);
      onSuccess?.();

      // Add message to user's chat
      const chatMessage = submissionType === 'trade-in' 
        ? `I've submitted my ${data.year} ${data.make} ${data.model} for trade-in consideration.`
        : `I've submitted my ${data.year} ${data.make} ${data.model} for your review.`;

      await addDoc(collection(db, `users/${user.uid}/chat_messages`), {
        text: chatMessage,
        userId: user.uid,
        userName: userName,
        createdAt: new Date()
      });

      navigate('/chat');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg whitespace-pre-line">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make *
          </label>
          <input
            {...register('make', { 
              required: 'Make is required',
              validate: value => {
                if (!value || !value.trim()) {
                  return 'Make cannot be empty';
                }
                return true;
              }
            })}
            className="w-full p-2 border rounded-md"
            type="text"
            placeholder="e.g., Toyota"
          />
          {errors.make && (
            <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model *
          </label>
          <input
            {...register('model', { 
              required: 'Model is required',
              validate: value => {
                if (!value || !value.trim()) {
                  return 'Model cannot be empty';
                }
                return true;
              }
            })}
            className="w-full p-2 border rounded-md"
            type="text"
            placeholder="e.g., Camry"
          />
          {errors.model && (
            <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            {...register('year', {
              required: 'Year is required',
              min: { value: 1900, message: 'Year must be 1900 or later' },
              max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
            })}
            className="w-full p-2 border rounded-md"
            type="number"
            placeholder="e.g., 2020"
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mileage *
          </label>
          <input
            {...register('mileage', {
              required: 'Mileage is required',
              min: { value: 0, message: 'Mileage must be positive' }
            })}
            className="w-full p-2 border rounded-md"
            type="number"
            placeholder="e.g., 50000"
          />
          {errors.mileage && (
            <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition *
          </label>
          <select
            {...register('condition', { required: 'Condition is required' })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          {errors.condition && (
            <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Price (ETB)
          </label>
          <input
            {...register('price', {
              min: { value: 0, message: 'Price must be positive' }
            })}
            className="w-full p-2 border rounded-md"
            type="number"
            placeholder="e.g., 500000"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VIN (Optional)
          </label>
          <input
            {...register('vin')}
            className="w-full p-2 border rounded-md"
            type="text"
            placeholder="Vehicle Identification Number"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Car Images *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Car image ${index + 1}`}
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
          Upload clear photos of your car. Include exterior and interior shots.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Details
        </label>
        <textarea
          {...register('description')}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Please provide any additional information about your car..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploadingImages}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 
         sourcePage === 'trade-in' ? 'Submit for Trade-In' : 'Submit Your Car'}
      </button>
    </form>
  );
};

export default CarSubmissionForm;