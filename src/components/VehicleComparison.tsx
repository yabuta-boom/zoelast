import React, { useState } from 'react';
import { X, Plus, Car, Fuel, Calendar, Settings, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  engine: string;
  transmission: string;
  fuelType: string;
  exterior: string;
  interior: string;
  images: string[];
}

interface VehicleComparisonProps {
  vehicles: Vehicle[];
  onClose: () => void;
}

const VehicleComparison: React.FC<VehicleComparisonProps> = ({ vehicles, onClose }) => {
  const { t } = useLanguage();
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find(v => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const removeVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
  };

  const comparisonFields = [
    { key: 'price', label: t('common.price'), icon: DollarSign, format: (value: number) => formatCurrency(value) },
    { key: 'year', label: t('common.year'), icon: Calendar, format: (value: number) => value.toString() },
    { key: 'mileage', label: t('vehicle.mileage'), icon: Car, format: (value: number) => `${value.toLocaleString()} mi` },
    { key: 'engine', label: t('vehicle.engine'), icon: Settings, format: (value: string) => value },
    { key: 'transmission', label: t('vehicle.transmission'), icon: Settings, format: (value: string) => value },
    { key: 'fuelType', label: t('vehicle.fuel'), icon: Fuel, format: (value: string) => value },
    { key: 'exterior', label: 'Exterior', icon: Car, format: (value: string) => value },
    { key: 'interior', label: 'Interior', icon: Car, format: (value: string) => value },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Vehicle Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {selectedVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Vehicles to Compare</h3>
              <p className="text-gray-600 mb-6">Choose up to 3 vehicles from the list below to compare their features.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <div key={vehicle.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={vehicle.images[0] || 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold mb-2">{vehicle.name}</h4>
                    <p className="text-blue-600 font-bold mb-3">{formatCurrency(vehicle.price)}</p>
                    <button
                      onClick={() => addVehicle(vehicle)}
                      disabled={selectedVehicles.length >= 3 || selectedVehicles.find(v => v.id === vehicle.id) !== undefined}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      Add to Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b font-semibold">Features</th>
                    {selectedVehicles.map((vehicle) => (
                      <th key={vehicle.id} className="text-center p-4 border-b min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => removeVehicle(vehicle.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                          <img
                            src={vehicle.images[0] || 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'}
                            alt={vehicle.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold">{vehicle.name}</h4>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <tr key={field.key} className="border-b">
                        <td className="p-4 font-medium flex items-center gap-2">
                          <Icon size={18} className="text-gray-500" />
                          {field.label}
                        </td>
                        {selectedVehicles.map((vehicle) => (
                          <td key={vehicle.id} className="p-4 text-center">
                            {field.format(vehicle[field.key as keyof Vehicle] as any)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selectedVehicles.length > 0 && selectedVehicles.length < 3 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                You can add {3 - selectedVehicles.length} more vehicle{3 - selectedVehicles.length !== 1 ? 's' : ''} to compare.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {vehicles
                  .filter(v => !selectedVehicles.find(sv => sv.id === v.id))
                  .slice(0, 3)
                  .map((vehicle) => (
                    <div key={vehicle.id} className="border rounded-lg p-3 bg-white">
                      <img
                        src={vehicle.images[0] || 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg'}
                        alt={vehicle.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h5 className="font-medium text-sm mb-2">{vehicle.name}</h5>
                      <button
                        onClick={() => addVehicle(vehicle)}
                        className="w-full flex items-center justify-center gap-1 bg-blue-600 text-white py-1 text-sm rounded hover:bg-blue-700"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleComparison;