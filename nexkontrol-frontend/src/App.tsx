
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/login';
import Register from './pages/register/register';
import PrivateRoute from './components/privateRouters/PrivateRoute';
import Dashboard from './pages/dash/Dashboard';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return(
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
