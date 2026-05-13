'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';

export function useRequireAuth(redirectTo: string = '/login') {
  const { islogin, hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !islogin) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, islogin, router, redirectTo]);
}

export function useRequireAdmin(redirectTo: string = '/') {
  const { islogin, hasHydrated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!islogin) { router.replace('/login'); return; }
    const isAdmin = user?.role_name?.toLowerCase() === 'admin';
    if (!isAdmin) router.replace(redirectTo);
  }, [hasHydrated, islogin, user, router, redirectTo]);
}

