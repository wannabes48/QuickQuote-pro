import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Quotes from './pages/Quotes';
import QuoteBuilder from './pages/QuoteBuilder';
import PublicQuote from './pages/PublicQuote';
import Invoices from './pages/Invoices';

const PrivateRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quote/:token" element={<PublicQuote />} />
          
          {/* Authenticated Routes with Layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<QuoteBuilder />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
