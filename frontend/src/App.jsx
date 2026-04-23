import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import OAuthSuccess from './pages/OAuthSuccess';
import Dashboard from './pages/Dashboard';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MoviesPage from './pages/MoviesPage';
import DiscoveryPage from './pages/DiscoveryPage';
import PaymentPage from './pages/PaymentPage';
import Lenis from 'lenis';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#0B0F1A] selection:bg-purple-600 selection:text-white transition-colors duration-500">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/stream" element={<DiscoveryPage type="stream" />} />
            <Route path="/events" element={<DiscoveryPage type="events" />} />
            <Route path="/plays" element={<DiscoveryPage type="plays" />} />
            <Route path="/sports" element={<DiscoveryPage type="sports" />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/events/:id/seats" element={<SeatSelectionPage />} />
            <Route path="/booking/:id/pay" element={<PaymentPage />} />
            <Route path="/booking/:id/confirmation" element={<BookingConfirmationPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
