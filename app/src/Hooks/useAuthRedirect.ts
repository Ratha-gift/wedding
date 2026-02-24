'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';

export function useRequireAuth(redirectTo: string = '/login') {
  const { islogin, hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check after rehydration
    if (hasHydrated && !islogin) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, islogin, router, redirectTo]);
}


