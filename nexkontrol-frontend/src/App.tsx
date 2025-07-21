
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/login';

function App() {
  return(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<h1>Dashboard (em construção)</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
