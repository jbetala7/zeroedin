'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with Three.js
const ShootingRange = dynamic(
  () => import('@/range/components/ShootingRange'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black" />
    ),
  }
);

export default function RangePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <ShootingRange />
    </main>
  );
}
