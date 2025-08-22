"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAutoescola from '@/hooks/useAutoescola';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function page() {
  const { autoescolas, searchAllAutoecolas, loading } = useAutoescola();
  const router = useRouter();
  const [loadingClick, setLoadingClick] = useState(false)

  useEffect(() => {
    const dado = localStorage.getItem("dados");
    console.log(dado);
    if (dado) {
      searchAllAutoecolas(dado)
    }
  }, []);

  const clickAutoescola = async (id) => {
    setLoadingClick(true)
    try {
      sessionStorage.setItem("id_autoescola", id);
      router.push('/inicio');
    } catch {
      return;
    }
    finally {
      setLoadingClick(false);
    }

  }

  const renderAutoescola = (autoescola) => {
    return (
      <div key={autoescola.autoescola_id}
        className='flex flex-col bg-white shadow-2xl p-4 rounded-md text-gray-500 justify-start items-start anim-hover'>
        <h1 className='font-bold text-start w-full'>Nome:</h1>
        <h2 className='text-start w-full'>{autoescola.nome}</h2>
        <h1 className='font-bold text-start w-full'>Endereço:</h1>
        <h2 className='text-start w-full'>{autoescola.endereco}</h2>
        <Button
          onClick={() => clickAutoescola(autoescola.autoescola_id)}
          className={'w-fit mt-3'}
        >
          Escolher
          <span className="material-icons">
            beenhere
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2 text-gray-500'>
      {(loading || loadingClick) && <Loading />}
      <div className='flex justify-between bg-white w-screen p-4 shadow-md left-0 top-0'>
        <h1 className='text-xl'>Olá! Seja Bem-Vindo</h1>
        <p></p>
        <Link href="/">
          <Button className="text-white px-4 py-2">
            Sair
            <span className="material-icons">logout</span>
          </Button>
        </Link>
      </div>
      <div className='flex flex-col p-5 gap-3'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold text-gray-700'>Escolha a Autoescola:</h1>
          <p>É só clicar na autoescola que você tem interesse em administrar!</p>
        </div>

        <div className='flex flex-col gap-5'>
          {autoescolas.map(autoescola =>
            renderAutoescola(autoescola)
          )}
        </div>
      </div>

    </div>
  )
}
