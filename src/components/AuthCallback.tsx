'use client';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const router = useRouter();
  const hasProcessedToken = useRef(false);
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token && !hasProcessedToken.current) {
      console.log("Token found in URL:", token);
      hasProcessedToken.current = true; // Mark as processed
      
      const fetchUserData = async () => {
        try {
          // Set the token in header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user info
          const { data } = await api.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/get-details`);
          
          if (data.success) {
            console.log("User data fetched successfully:", data.user);
            
            // Store token and user data
            login(token, data.user);
            
            // Create a new URL without the token parameter
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            
            // Replace the current URL with the clean URL
            window.history.replaceState({}, '', url.toString());
          }
        } catch (error) {
          console.error('Failed to get user info:', error);
        }
      };
      
      fetchUserData();
    }
  }, [searchParams, login, router]);
  
  return null; // This component doesn't render anything
}