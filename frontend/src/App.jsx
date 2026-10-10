import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CoordinationProvider } from './context/CoordinationContext';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoordinationProvider>
          <AppRoutes />
        </CoordinationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
