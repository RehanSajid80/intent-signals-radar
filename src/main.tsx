
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { HubspotProvider } from './context/hubspot';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';

// Error reporting for production
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <HubspotProvider>
          <App />
          <Toaster />
        </HubspotProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
