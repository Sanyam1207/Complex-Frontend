// components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { openPopup } from '@/redux/slices/showPopups';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Define public routes that don't require authentication
  const publicRoutes = ['/home', '/show-listing', '/messages', '/profile', "/wishlist"];
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Skip authentication check for public routes
    if (isPublicRoute) return;

    // If not authenticated and not loading, show onboarding popup and redirect to home
    if (!isAuthenticated && !loading) {
      // Store the intended route in localStorage so you can redirect back after login
      localStorage.setItem('redirectAfterLogin', pathname);

      // Open the onboarding popup
      dispatch(openPopup('onboarding'));

      // Redirect to home
      router.push('/home');
    }
  }, [isAuthenticated, loading, pathname, router, dispatch, isPublicRoute]);

  // If it's a public route, always render children
  if (isPublicRoute) {
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