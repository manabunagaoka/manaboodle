// src/app/page.tsx
import { MainLayout } from '@/components/layouts/MainLayout';
import { TimeCapsule } from '@/components/sections/TimeCapsule';

export default function Home() {
  return (
    <MainLayout>
      <TimeCapsule />
    </MainLayout>
  );
}