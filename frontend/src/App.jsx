import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CoordinationProvider } from './context/CoordinationContext';
import AnimatedBackground from './components/layout/AnimatedBackground';
import InteractiveCursor from './components/layout/InteractiveCursor';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CoordinationProvider>
          {/* Global High-Tech Interactive Background & Cursor Effects */}
          <AnimatedBackground />
          <InteractiveCursor />
          <AppRoutes />
        </CoordinationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
