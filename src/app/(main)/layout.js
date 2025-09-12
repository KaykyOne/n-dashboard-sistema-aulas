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
import Link from "next/link";

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

  const local = pathname.replace("/", "");
  const localList = local.split("/");

  function navgationInterno() {
    return (
      <div className="flex gap-2 ml-4 mb-4">
        <Link href="/inicio" className="capitalize mb-5 text-gray-500 cursor-pointer transition-all duration-300 hover:opacity-80">Inicio</Link>
        {
          local.split("/").map((item, index) => (
            <div className="flex" key={index}>
              <p>&gt;</p>
              <Link href={`${item.toLocaleLowerCase() == localList[localList.length -1].toLocaleLowerCase() ? pathname : `/${item}`}`} className=" ml-2 capitalize text-gray-500 cursor-pointer transition-all duration-300 hover:opacity-80">{item}</Link>
            </div>
          ))
        }

      </div>
    )
  }

  return (
    <div>
      <div className={`bg-background flex ${loading ? 'overflow-hidden' : 'overflow-y-auto'}`} id="body">
        <div className={`flex-1 flex h-s min-h-screen`}>
          {siderbarVisivel && <Sidebar siderbarVisivel={siderbarVisivel} setSiderbarVisivel={setSiderbarVisivel} />}
          <div className="flex flex-col flex-1">
            <Header setSiderbarVisivel={setSiderbarVisivel} siderbarVisivel={siderbarVisivel} />
            <main className={`p-6`}>
              <LoadingUIProvider loading={loading}>
                {local != "inicio" && <h1 className="text-3xl ml-4 capitalize font-semibold text-gray-700">{localList[localList.length -1]}</h1>}
                {local != 'inicio' && navgationInterno()}
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

      </div>
    </div>
  );
}
