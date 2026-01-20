// hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' in older versions
import { useAuth } from '../lib/useAuth';

export function useRequireAuth(redirectTo: string = '/login') {
  const { islogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!islogin) {
      router.replace(redirectTo);
    }
  }, [islogin, router, redirectTo]);
}