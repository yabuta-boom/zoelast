import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LanguageToggle from './components/LanguageToggle';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetails from './pages/VehicleDetails';
import SpareParts from './pages/SpareParts';
import SparePartDetails from './pages/SparePartDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import SendUsYourCar from './pages/SendUsYourCar';
import TradeIn from './pages/TradeIn';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import Login from './pages/Login';
import Profile from './pages/user/Profile';
import LikedVehicles from './pages/user/LikedVehicles';
import SavedVehicles from './pages/user/SavedVehicles';
import Chat from './pages/user/Chat';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/spare-parts" element={<SpareParts />} />
          <Route path="/spare-parts/:id" element={<SparePartDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/send-us-your-car" element={<SendUsYourCar />} />
          <Route path="/trade-in" element={<TradeIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/liked-vehicles" element={<LikedVehicles />} />
          <Route path="/saved-vehicles" element={<SavedVehicles />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {!isAdminRoute && <LanguageToggle />}
    </div>
  );
}

export default App;