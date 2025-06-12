import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '../../components/FirebaseProvider';
import { User, Mail, Phone, Calendar, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: any;
}

const Profile = () => {
  const { user } = useAuth();
  const { db } = useFirebase();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, db]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, formData);
      setProfile(prev => ({ ...prev!, ...formData }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <User />
              Profile
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium break-all">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {profile?.createdAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;