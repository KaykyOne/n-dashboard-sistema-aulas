// app/(auth)/layout.js
import "../globals.css";
import LoadingUIProvider from '../LoadingProvider';
export default function AuthLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className="bg-gray-100">
        <LoadingUIProvider>
          {children}
        </LoadingUIProvider>
      </body>
    </html>
  )
}
