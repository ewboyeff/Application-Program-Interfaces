/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDataStore } from './store/useDataStore';
import { useCategoryStore } from './store/useCategoryStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/utils/ScrollToTop';
import { BackToTop } from './components/ui/BackToTop';
import { ADMIN, ap } from './lib/adminPath';
import Home from './pages/Home';
import Funds from './pages/Funds';
import FundDetail from './pages/FundDetail';
import Ranking from './pages/Ranking';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import Tadqiqot from './pages/Tadqiqot';
import Hamkorlik from './pages/Hamkorlik';
import Boglanish from './pages/Boglanish';
import Metodologiya from './pages/Metodologiya';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminFunds } from './pages/admin/Funds';
import { AdminFundEdit } from './pages/admin/FundEdit';
import { AdminReviews } from './pages/admin/Reviews';
import { AdminComplaints } from './pages/admin/Complaints';
import { AdminProjects } from './pages/admin/Projects';
import { AdminReports } from './pages/admin/Reports';
import { AdminUsers } from './pages/admin/Users';
import { AdminNews } from './pages/admin/News';
import { AdminIndexes } from './pages/admin/Indexes';
import { AdminSettings } from './pages/admin/Settings';
import { AdminPartners } from './pages/admin/Partners';
import { AdminApplications } from './pages/admin/Applications';
import { AdminResearch } from './pages/admin/Research';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) return null;

  if (!user) {
    return <Navigate to={`/login?redirectTo=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

const PlaceholderPage = ({ name }: { name: string }) => (
  <Layout>
    <div className="py-20 text-center text-slate-500">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{name}</h1>
      <p className="text-lg">Tez orada bu sahifa tayyor bo'ladi.</p>
      <div className="mt-8 inline-block px-6 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
        Coming soon
      </div>
    </div>
  </Layout>
);

function AppInit() {
  const { fetchFunds, fetchNews } = useDataStore();
  const { fetch: fetchCategories } = useCategoryStore();
  useEffect(() => {
    fetchFunds();
    fetchNews();
    fetchCategories();
  }, []);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <AppInit />
            <ScrollToTop />
            <BackToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/funds/:slug" element={<FundDetail />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/news" element={<News />} />
              <Route path="/tadqiqot" element={<Tadqiqot />} />
              <Route path="/hamkorlik" element={<Hamkorlik />} />
              <Route path="/boglanish" element={<Boglanish />} />
              <Route path="/metodologiya" element={<Metodologiya />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path={ADMIN} element={<Navigate to={ap('/dashboard')} replace />} />
              <Route path={ap('/login')} element={<AdminLogin />} />
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path={ap('/dashboard')} element={<AdminDashboard />} />
                  <Route path={ap('/funds')} element={<AdminFunds />} />
                  <Route path={ap('/funds/new')} element={<AdminFundEdit />} />
                  <Route path={ap('/funds/:id')} element={<AdminFundEdit />} />
                  <Route path={ap('/projects')} element={<AdminProjects />} />
                  <Route path={ap('/reports')} element={<AdminReports />} />
                  <Route path={ap('/users')} element={<AdminUsers />} />
                  <Route path={ap('/reviews')} element={<AdminReviews />} />
                  <Route path={ap('/complaints')} element={<AdminComplaints />} />
                  <Route path={ap('/news')} element={<AdminNews />} />
                  <Route path={ap('/indexes')} element={<AdminIndexes />} />
                  <Route path={ap('/partners')} element={<AdminPartners />} />
                  <Route path={ap('/applications')} element={<AdminApplications />} />
                  <Route path={ap('/settings')} element={<AdminSettings />} />
                  <Route path={ap('/research')} element={<AdminResearch />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
