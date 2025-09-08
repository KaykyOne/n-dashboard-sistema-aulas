'use client';

import Loading from '@/components/Loading';

export default function LoadingProvider({ children, loading }) {


  return (
    <div className={`relative flex-1 ${loading && "h-screen"}`}>
      {loading && <Loading/>}
      {children}
    </div>
  );
}
