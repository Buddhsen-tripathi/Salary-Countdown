'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      else setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  return <>{children}</>;
}
