import "../globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from 'react-toastify';
import LoadingUIProvider from '../LoadingProvider';

export default function RootLayout({ children }) {
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
