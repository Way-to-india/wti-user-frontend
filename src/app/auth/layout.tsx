'use client';
import AuthLayout from '@/components/auth/AuthLayout';
import CircleLoader from '@/components/CircleLoader';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<CircleLoader />}>
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  );
}
