
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts'));
const ContactDetails = lazy(() => import('./pages/ContactDetails'));
const AccountDetails = lazy(() => import('./pages/AccountDetails'));
const IntentPage = lazy(() => import('./pages/IntentPage'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/accounts" element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          } />
          <Route path="/contact/:contactId" element={
            <ProtectedRoute>
              <ContactDetails />
            </ProtectedRoute>
          } />
          <Route path="/account/:accountId" element={
            <ProtectedRoute>
              <AccountDetails />
            </ProtectedRoute>
          } />
          <Route path="/intent" element={
            <ProtectedRoute>
              <IntentPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
