import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { db } from './lib/mock-db';
import { User } from './types';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Convert from './pages/Convert';
import VTU from './pages/VTU';
import Admin from './pages/Admin';
import Vendor from './pages/Vendor';
import Profile from './pages/Profile';
import PurchaseHistory from './pages/PurchaseHistory';
import PrintLayout from './pages/PrintLayout';
import Layout from './components/Layout';
import { Toaster } from 'sonner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    setUser(currentUser);
    
    // Protected routes check
    const publicPaths = ['/', '/login', '/register'];
    if (!currentUser && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/wallet" element={<Wallet user={user} />} />
          <Route path="/convert" element={<Convert user={user} />} />
          <Route path="/vtu" element={<VTU user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/print-pins" element={<PrintLayout />} />
          
          {/* Role specific routes */}
          {user?.role === 'admin' && <Route path="/admin" element={<Admin />} />}
          {user?.role === 'vendor' && <Route path="/vendor" element={<Vendor user={user} />} />}
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
