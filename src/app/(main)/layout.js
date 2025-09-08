"use client"
import { useState, useEffect } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';
import LoadingUIProvider from '../LoadingProvider';
import { Button } from "@/components/ui/button";
import Help from "@/components/Help";
import { usePathname } from 'next/navigation';


export default function RootLayout({ children }) {
  const [helpVisivel, setHelpVisivel] = useState(false);
  const [siderbarVisivel, setSiderbarVisivel] = useState(true);

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
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={`bg-background flex ${loading ? 'overflow-hidden' : 'overflow-y-auto'}`} id="body">
        <div className={`flex-1 flex h-s min-h-screen`}>
          {siderbarVisivel && <Sidebar siderbarVisivel={siderbarVisivel} setSiderbarVisivel={setSiderbarVisivel} />}
          <div className="flex flex-col flex-1">
            <Header setSiderbarVisivel={setSiderbarVisivel} siderbarVisivel={siderbarVisivel} />
            <main className={`p-6`}>
              <LoadingUIProvider loading={loading}>
                {children}
              </LoadingUIProvider>
            </main>
          </div>
        </div>

        {helpVisivel && <Help open={helpVisivel} setOpen={setHelpVisivel} />}

        <Button
          className="fixed text-5xl bottom-4 right-6 rounded-full h-20 w-20 shadow-2xl"
          onClick={() => setHelpVisivel(!helpVisivel)}>
          ?
        </Button>

        <ToastContainer
          theme="colored"
          closeOnClick={true}
          limit={4}
          newestOnTop={true}
          closeButton={true}
          position="top-right"
          pauseOnHover={true} />

      </body>
    </html>
  );
}
