import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '@/src/store/useAdminAuthStore';
import { useInactivityTimeout } from '@/src/hooks/useInactivityTimeout';
import { ap } from '@/src/lib/adminPath';

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

export const AdminProtectedRoute: React.FC = () => {
  const { isAdminAuthenticated, checkAdminSession, adminLogout } = useAdminAuthStore();
  const [checking, setChecking] = useState(true);

  // On mount: silently try to restore admin token via HttpOnly cookie
  useEffect(() => {
    checkAdminSession().finally(() => setChecking(false));
  }, []);

  // Auto-logout after 30 minutes of inactivity
  useInactivityTimeout(adminLogout, INACTIVITY_MS, isAdminAuthenticated);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to={ap('/login')} replace />;
  }

  return <Outlet />;
};
