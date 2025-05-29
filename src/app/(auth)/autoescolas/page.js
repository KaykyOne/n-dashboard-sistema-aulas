"use client"

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAutoescola from '@/hooks/useAutoescola';
import { useRouter } from 'next/navigation';

export default function page() {
  const { autoescolas, searchAllAutoecolas } = useAutoescola();
  const router = useRouter();

  useEffect(() => {
    const dado = localStorage.getItem("dados");
    console.log(dado);
    if (dado) {
      searchAllAutoecolas(dado)
    }
  }, []);

  const clickAutoescola = (id) => {
    sessionStorage.setItem("id_autoescola", id);
    router.push('/inicio');
  }

  const renderAutoescola = (autoescola) => {
    return (
      <div key={autoescola.autoescola_id}
        className='flex flex-col bg-white shadow-2xl p-2 rounded-md text-black justify-start items-center duration-300 hover:scale-102'>
        <h1 className='font-bold text-start w-full'>Nome:</h1>
        <h2 className='text-start w-full'>{autoescola.nome}</h2>
        <h1 className='font-bold text-start w-full'>Endereço:</h1>
        <h2 className='text-start w-full'>{autoescola.endereco}</h2>
        <Button
          onClick={() => clickAutoescola(autoescola.autoescola_id)}
          className={'w-full mt-3'}
        >Escolher</Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between bg-white w-screen p-4 shadow-md left-0 top-0'>
        <h1 className='text-xl'>Olá! Seja Bem-Vindo</h1>
        <Link href="/">
          <Button className="text-white px-4 py-2">
            Sair
            <span className="material-icons">logout</span>
          </Button>
        </Link>
      </div>

      <div className='flex p-2 gap-5'>
        {autoescolas.map(autoescola =>
          renderAutoescola(autoescola)
        )}
      </div>
    </div>
  )
}
