// app/analytics-tracker.tsx
'use client';


import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { analytics, logEvent } from '@/lib/firebase';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
