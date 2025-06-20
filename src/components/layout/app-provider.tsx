'use client';

import { AuthProvider } from '@/context/auth-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
