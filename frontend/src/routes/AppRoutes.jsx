import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth, getHomeRouteForRole } from '../context/AuthContext';

import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import HRDashboard from '../pages/hr/HRDashboard';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import Approvals from '../pages/Approvals';
import Reports from '../pages/Reports';
import Documents from '../pages/Documents';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AuditLogs from '../pages/admin/AuditLogs';
import Users from '../pages/admin/Users';
import Roles from '../pages/admin/Roles';
import Permissions from '../pages/admin/Permissions';
import Settings from '../pages/Settings';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Coordination from '../pages/Coordination';
import ProtectedRoute from '../components/authentication/ProtectedRoute';

function RoleHomeRouter() {
  const { user } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();
  
  if (role === 'hr') return <Navigate to="/hr" replace />;
  if (role === 'sales') return <Navigate to="/sales" replace />;
  if (role === 'support' || role === 'staff') return <Navigate to="/support" replace />;
  if (role === 'employee') return <Navigate to="/chat" replace />;
  return <Dashboard />;
}

function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();
  
  if (role === 'admin' || allowedRoles.includes(role)) {
    return children;
  }
  return <Navigate to={getHomeRouteForRole(role)} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/:roleId" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          {/* Dynamic Role Landing Home */}
          <Route index element={<RoleHomeRouter />} />

          {/* AI Agents Chat available to all with role-based internal restrictions */}
          <Route path="chat" element={<Chat />} />

          {/* Department-Specific Routes */}
          <Route path="hr/*" element={<RoleGuard allowedRoles={['hr']}><HRDashboard /></RoleGuard>} />
          <Route path="sales/*" element={<RoleGuard allowedRoles={['sales']}><SalesDashboard /></RoleGuard>} />
          <Route path="support/*" element={<RoleGuard allowedRoles={['support', 'staff']}><SupportDashboard /></RoleGuard>} />

          {/* Operational Modules */}
          <Route path="approvals" element={<RoleGuard allowedRoles={['admin', 'hr', 'sales', 'support', 'staff']}><Approvals /></RoleGuard>} />
          <Route path="reports" element={<RoleGuard allowedRoles={['admin', 'hr', 'sales']}><Reports /></RoleGuard>} />
          <Route path="documents" element={<Documents />} />

          {/* Admin & Governance Routes (Admin Only) */}
          <Route path="coordination" element={<RoleGuard allowedRoles={['admin']}><Coordination /></RoleGuard>} />
          <Route path="admin" element={<RoleGuard allowedRoles={['admin']}><AdminDashboard /></RoleGuard>} />
          <Route path="admin/audit-logs" element={<RoleGuard allowedRoles={['admin']}><AuditLogs /></RoleGuard>} />
          <Route path="admin/users" element={<RoleGuard allowedRoles={['admin']}><Users /></RoleGuard>} />
          <Route path="admin/roles" element={<RoleGuard allowedRoles={['admin']}><Roles /></RoleGuard>} />
          <Route path="admin/permissions" element={<RoleGuard allowedRoles={['admin']}><Permissions /></RoleGuard>} />

          <Route path="settings" element={<Settings />} />

          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '20vh', color: 'var(--text-muted)' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Page Not Found</h2>
              <p>The requested page does not exist or you do not have permission to view it.</p>
            </div>
          } />
        </Route>
      </Route>
    </Routes>
  );
}
