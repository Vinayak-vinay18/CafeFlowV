import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import POSBilling from './pages/POSBilling';
import CustomerManagement from './pages/CustomerManagement';
import CustomerProfile from './pages/CustomerProfile';
import OrderManagement from './pages/OrderManagement';
import SalesHistory from './pages/SalesHistory';
import Settings from './pages/Settings';
import Invoice from './pages/Invoice';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-orange-light">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#ff7a00', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="billing" element={<POSBilling />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="customers/:id" element={<CustomerProfile />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="sales" element={<SalesHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="invoice/:id" element={<Invoice />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
