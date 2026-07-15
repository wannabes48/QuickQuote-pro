import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';

// Lazy load pages for better performance (code splitting)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Quotes = React.lazy(() => import('./pages/Quotes'));
const QuoteBuilder = React.lazy(() => import('./pages/QuoteBuilder'));
const PublicQuote = React.lazy(() => import('./pages/PublicQuote'));
const Invoices = React.lazy(() => import('./pages/Invoices'));
const Payments = React.lazy(() => import('./pages/Payments'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Features = React.lazy(() => import('./pages/Features'));
const About = React.lazy(() => import('./pages/About'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const IndustryLandingPage = React.lazy(() => import('./pages/IndustryLandingPage'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));

const PrivateRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white"><span className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></span></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/quote/:token" element={<PublicQuote />} />
          
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/industries/:industryId" element={<IndustryLandingPage />} />
          
          {/* Authenticated Routes with Layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<QuoteBuilder />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
