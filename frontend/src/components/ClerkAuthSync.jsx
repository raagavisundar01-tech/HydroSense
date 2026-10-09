import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const ClerkAuthSync = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { user: appUser, syncClerkUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSync = async () => {
      if (isLoaded && isSignedIn && clerkUser) {
        // If app user is not logged in or email doesn't match clerk user
        const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
        if (!appUser || appUser.email !== clerkEmail) {
          try {
            // Check if there is a pending role selection in session
            const pendingRole = sessionStorage.getItem('hydrosense_clerk_role') || 'resident';
            const data = await syncClerkUser(clerkUser, pendingRole);

            // Redirect if currently on login or register
            if (location.pathname === '/login' || location.pathname === '/register') {
              if (data.user.role === 'admin') navigate('/admin/dashboard');
              else if (data.user.role === 'staff') navigate('/staff/dashboard');
              else navigate('/resident/dashboard');
            }
          } catch (err) {
            console.error('Error syncing Clerk user to HydroSense backend:', err);
            // If the user isn't registered manually yet, the backend returns 403
            const errMsg = err.response?.data?.message || 'Google Sign-In failed. Please register manually first.';
            
            // Sign them out of Clerk to prevent an infinite loop where Clerk thinks they're logged in
            // but the backend refuses to give them a token
            if (clerkUser) {
              await clerkUser.session?.end?.().catch(e => console.warn(e));
            }
            
            // Send them back to login page with the error
            navigate('/login', { state: { error: errMsg } });
          }
        }
      }
    };

    handleSync();
  }, [isLoaded, isSignedIn, clerkUser, appUser, navigate, location.pathname, syncClerkUser]);

  return null;
};

export default ClerkAuthSync;
