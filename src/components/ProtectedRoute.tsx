// components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, setShowLoginModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip authentication check for the homepage
    if (pathname === '/home') return;
    
    // If not authenticated and not loading, show login modal and redirect to home
    if (!isAuthenticated && !loading) {
      router.push('/home');
    }
  }, [isAuthenticated, loading, pathname, router, setShowLoginModal]);

  // If it's the homepage, always render children
  if (pathname === '/home') {
    return <>{children}</>;
  }

  // If loading, show loading indicator
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // For protected routes, only render if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;