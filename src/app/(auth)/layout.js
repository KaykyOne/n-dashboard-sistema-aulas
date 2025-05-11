// app/(auth)/layout.js
import "../globals.css";
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
        {children}
      </body>
    </html>
  )
}
