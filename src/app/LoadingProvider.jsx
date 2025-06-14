'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

export default function LoadingProvider({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // quando a rota começa a mudar

    const timeout = setTimeout(() => {
      setLoading(false); // quando a rota "termina" de mudar (simulado)
    }, 500); // você pode ajustar esse tempo

    return () => clearTimeout(timeout);
  }, [pathname]); // dispara sempre que a rota mudar

  return (
    <>
      {loading && <Loading/>}
      {children}
    </>
  );
}
