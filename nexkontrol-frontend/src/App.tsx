
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/login';
import Register from './pages/register/register';
import PrivateRoute from './components/privateRouters/PrivateRoute';
import Dashboard from './pages/dash/Dashboard';
import HomePage from './pages/HomePage/HomePage';
import { ToastProvider } from './Context/ToastContext';

function App() {
  return(
  <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>} />
      </Routes>
    </ToastProvider>
    </BrowserRouter>
  )
}

export default App;
