// app/components/ErrorPage.js
'use client';

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-3xl font-bold text-red-800">Algo deu errado</h1>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 bg-red-800 hover:bg-red-800 text-white px-4 py-2 rounded"
      >
        Tentar novamente
      </button>
    </div>
  );
}
