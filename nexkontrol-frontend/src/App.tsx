
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css'
import PrivateRoute from './components/privateRouters/PrivateRoute';
import { ToastProvider } from './Context/ToastContext';
import { AuthProvider } from './Context/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const Login = lazy(() => import('./pages/login/login'));
const Register = lazy(() => import('./pages/register/register'));
const Dashboard = lazy(() => import('./pages/dash/Dashboard'));

function App() {
  return(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner size="xl" text="Carregando..." />}>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard/>
                </PrivateRoute>} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App;
