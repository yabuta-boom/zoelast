import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { formatCurrency } from '../utils/formatters';

interface SparePart {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  condition: string;
  compatibility: string[];
  partNumber: string;
  description: string;
  images: string[];
  stock: number;
  warranty: string;
  specifications: Record<string, string>;
  features: string[];
}

export default function SparePartDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState<SparePart | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { db } = useFirebase();

  useEffect(() => {
    const fetchPartDetails = async () => {
      if (!id) return;

      try {
        const partRef = doc(db, 'spare_parts', id);
        const partDoc = await getDoc(partRef);
        
        if (partDoc.exists()) {
          setPart({
            id: partDoc.id,
            ...partDoc.data()
          } as SparePart);
        } else {
          setPart(null);
        }
      } catch (error) {
        console.error('Error fetching part details:', error);
        setPart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPartDetails();
  }, [id, db]);

  const handleScheduleInquiry = () => {
    navigate('/contact', {
      state: {
        partDetails: {
          name: part?.name,
          brand: part?.brand,
          partNumber: part?.partNumber,
          condition: part?.condition
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full pt-24 flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="w-full pt-24">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900">Part not found</h1>
          <button
            onClick={() => navigate('/spare-parts')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Spare Parts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
              <img
                src={part.images[activeImage] || 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                alt={part.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {part.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative pb-[56.25%] rounded-lg overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${part.name} view ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Part Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{part.name}</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {part.category}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(part.price)}
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p>{part.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Brand</h3>
                <p>{part.brand}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Part Number</h3>
                <p>{part.partNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Condition</h3>
                <p>{part.condition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Stock Status</h3>
                <p>{part.stock > 0 ? `${part.stock} units available` : 'Out of Stock'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Warranty</h3>
                <p>{part.warranty}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Compatible Vehicles</h3>
              <div className="grid grid-cols-2 gap-2">
                {part.compatibility.map((vehicle, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    {vehicle}
                  </div>
                ))}
              </div>
            </div>

            {part.specifications && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(part.specifications).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{key}</h4>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {part.features && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  {part.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleScheduleInquiry}
              disabled={part.stock === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {part.stock === 0 ? 'Out of Stock' : 'Inquire About This Part'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}