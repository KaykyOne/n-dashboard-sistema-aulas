'use client'
import './globals.css'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! Página não encontrada 🚧
      </p>
      <a
        href="/"
        className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-80 transition"
      >
        Voltar para o inicio
      </a>
    </div>
  );
}
