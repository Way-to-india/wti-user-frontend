'use client';
import { Suspense } from 'react';
import LandingSkeleton from '../components/shared/LandingSkeleton';
import NewLandingPage from './general/NewLandingPage';

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LandingSkeleton />}>
        <NewLandingPage />
      </Suspense>
    </main>
  );
}
