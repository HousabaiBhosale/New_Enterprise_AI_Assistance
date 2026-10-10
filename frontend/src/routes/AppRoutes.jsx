import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import HRDashboard from '../pages/hr/HRDashboard';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import Approvals from '../pages/Approvals';
import Reports from '../pages/Reports';
import Documents from '../pages/Documents';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Settings from '../pages/Settings';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Coordination from '../pages/Coordination';
import ProtectedRoute from '../components/authentication/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/:roleId" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="coordination" element={<Coordination />} />
          <Route path="hr/*" element={<HRDashboard />} />
          <Route path="sales/*" element={<SalesDashboard />} />
          <Route path="support/*" element={<SupportDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="documents" element={<Documents />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '20vh', color: 'var(--text-muted)' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Coming Soon</h2>
              <p>This module is currently under development.</p>
            </div>
          } />
        </Route>
      </Route>
    </Routes>
  );
}
