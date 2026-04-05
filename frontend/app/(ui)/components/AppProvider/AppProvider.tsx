'use client';
import { useEffect } from 'react';
import { authStore } from '@/Auth/auth.store';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    authStore.hydrate();
  }, []);

  return <>{children}</>;
}