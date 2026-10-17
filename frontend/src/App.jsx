import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ConfirmProvider } from './components/ConfirmDialog.jsx';
import { SiteLayout } from './components/layout/SiteLayout.jsx';
import { ToastProvider } from './components/Toaster.jsx';
import { AuthProvider } from './features/auth/AuthProvider.jsx';
import { ProtectedRoute } from './features/auth/ProtectedRoute.jsx';
import { SiteSettingsProvider } from './features/settings/SiteSettingsProvider.jsx';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import HomePage from './pages/HomePage.jsx';
import { ThemeProvider } from './theme/ThemeProvider.jsx';

const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ClinicsPage = lazy(() => import('./pages/ClinicsPage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                <SiteSettingsProvider>
                  <Routes>
                    <Route element={<SiteLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="services" element={<ServicesPage />} />
                      <Route path="clinics" element={<ClinicsPage />} />
                      <Route path="book" element={<BookingPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route element={<SiteLayout minimal />}>
                      <Route path="login" element={<LoginPage />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="change-password" element={<ChangePasswordPage />} />
                        <Route path="dashboard/*" element={<DashboardPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </SiteSettingsProvider>
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  );
}
