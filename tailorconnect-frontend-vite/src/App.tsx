import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Pages (lazy loaded for performance)
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/Home'));
const LoginPage = lazy(() => import('@/pages/Login'));
const SignupPage = lazy(() => import('@/pages/Signup'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const DesignsPage = lazy(() => import('@/pages/Designs'));
const DesignDetailPage = lazy(() => import('@/pages/DesignDetail'));
const DesignGeneratePage = lazy(() => import('@/pages/DesignGenerate'));
const TailorsPage = lazy(() => import('@/pages/Tailors'));
const TailorDetailPage = lazy(() => import('@/pages/TailorDetail'));
const OrdersPage = lazy(() => import('@/pages/Orders'));
const MeasurementsPage = lazy(() => import('@/pages/Measurements'));
const ReviewsPage = lazy(() => import('@/pages/Reviews'));
const PaymentsPage = lazy(() => import('@/pages/Payments'));
const ChatPage = lazy(() => import('@/pages/Chat'));
const ClientDetailPage = lazy(() => import('@/pages/ClientDetail'));
const ContactPage = lazy(() => import('@/pages/Contact'));
const AboutPage = lazy(() => import('@/pages/About'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'));

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/designs" element={<DesignsPage />} />
            <Route path="/designs/generate" element={<DesignGeneratePage />} />
            <Route path="/designs/:id" element={<DesignDetailPage />} />
            <Route path="/tailors" element={<TailorsPage />} />
            <Route path="/tailors/:id" element={<TailorDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/measurements" element={<MeasurementsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <LanguageProvider>
            <AppLayout />
          </LanguageProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
