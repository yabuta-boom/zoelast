import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import type { Vehicle } from '../hooks/useVehicles';

interface CreateVehicleData extends Omit<Vehicle, 'id' | 'createdAt' | 'image'> {
  imageFile: File;
}

export const createVehicle = async (vehicleData: CreateVehicleData) => {
  try {
    // Upload image first
    const imageRef = ref(storage, `vehicles/${Date.now()}_${vehicleData.imageFile.name}`);
    const uploadResult = await uploadBytes(imageRef, vehicleData.imageFile);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Create vehicle document
    const { imageFile, ...vehicleDataWithoutFile } = vehicleData;
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicleDataWithoutFile,
      image: imageUrl,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw new Error('Failed to create vehicle');
  }
};

export const updateVehicle = async (
  id: string, 
  updates: Partial<CreateVehicleData>
) => {
  try {
    const vehicleRef = doc(db, 'vehicles', id);
    let updateData = { ...updates };

    // If there's a new image, upload it
    if (updates.imageFile) {
      const imageRef = ref(storage, `vehicles/${Date.now()}_${updates.imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, updates.imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      // Remove imageFile from updates and add new image URL
      const { imageFile, ...rest } = updateData;
      updateData = {
        ...rest,
        image: imageUrl
      };
    }

    await updateDoc(vehicleRef, updateData);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw new Error('Failed to update vehicle');
  }
};

export const deleteVehicle = async (id: string, imageUrl: string) => {
  try {
    // Delete image from storage
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    // Delete vehicle document
    await deleteDoc(doc(db, 'vehicles', id));
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw new Error('Failed to delete vehicle');
  }
};