import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
})

// Check for PWA installation prompt
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Optionally show a custom install button
  console.log('PWA install prompt available');
});

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register service worker in production
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    } else {
      console.log('Service Worker registration skipped in development');
    }
  });
}

// Error boundary
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando YISA...</p>
        </div>
      </div>
    }>
      {children}
    </React.Suspense>
  );
}

// App initialization
const initApp = () => {
  // Check if app is running in standalone mode (PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone;

  if (isStandalone) {
    document.body.classList.add('pwa-standalone');
  }

  // Check for dark mode preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  }

  // Initialize app settings from localStorage if available
  try {
    const savedSettings = localStorage.getItem('yisa_app_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      // Apply theme preference
      if (settings.theme) {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      }

      // Apply language preference
      if (settings.language) {
        document.documentElement.lang = settings.language;
      }
    }
  } catch (error) {
    console.warn('Failed to load app settings:', error);
  }
};

// Initialize the app
initApp();

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          {/* {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )} */}
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Make install prompt available globally for custom install UI
(window as any).deferredPrompt = deferredPrompt;

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  const reportWebVitals = async (onPerfEntry?: (metric: any) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      } catch (error) {
        console.warn('Failed to load web vitals:', error);
      }
    }
  };

  reportWebVitals((metric) => {
    console.log('Web Vitals:', metric);
    // Send to analytics service here
  });
}

export type AppDispatch = typeof queryClient;