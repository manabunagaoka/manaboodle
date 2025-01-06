'use client';

import MainLayout from '@/components/layouts/MainLayout';
import TimeCapsule from '@/components/sections/TimeCapsule';
// Or try named imports:
// import { MainLayout } from '@/components/layouts/MainLayout';
// import { TimeCapsule } from '@/components/sections/TimeCapsule';

export default function Home() {
  return (
    <MainLayout>
      <TimeCapsule />
    </MainLayout>
  );
}