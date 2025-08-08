"use client"
import { useState } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';
import LoadingUIProvider from '../LoadingProvider';
import { Button } from "@/components/ui/button";
import Help from "@/components/Help";

export default function RootLayout({ children }) {
  const [helpVisivel, setHelpVisivel] = useState();
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className="bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 ml-20 lg:ml-56">
          <Header />
          <main className="p-6">
            <LoadingUIProvider>
              {children}
            </LoadingUIProvider>
          </main>
        </div>

        {helpVisivel && <Help open={helpVisivel} setOpen={setHelpVisivel}/>}

        <Button
          className="fixed text-5xl bottom-4 right-6 rounded-full h-20 w-20 shadow-2xl"
        onClick={() => setHelpVisivel(!helpVisivel)}>
          ?
        </Button>

        <ToastContainer
          theme="colored"
          closeOnClick={false}
          limit={4}
          newestOnTop={true}
          closeButton={true}
          position="top-right"
          pauseOnHover={true} />

      </body>
    </html>
  );
}
