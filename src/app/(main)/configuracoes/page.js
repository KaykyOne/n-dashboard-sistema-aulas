"use client"
import React, { useEffect, useState } from 'react'
import useAutoescola from '@/hooks/useAutoescola'
import Loading from '@/components/Loading';

export default function ConfiguracoesPage() {
  const { getConfigs, loading } = useAutoescola();
  const [configs, setConfigs] = useState([]);


  useEffect(() => {
    const searchConfigs = async () => {
      const res = await getConfigs();
      setConfigs(res || []);
    }

    searchConfigs();
  }, [])

  return (
    <div className='flex flex-col gap-4 p-5'>
      <div className='flex flex-col'>
        <h1 className='text-4xl font-bold'>Configurações</h1>
        <h3>Aqui você pode mudar como o sistema funciona!</h3>
      </div>
      {loading && <Loading />}
      <div className='flex flex-col gap-5 w-full'>
        {configs.length > 0 ? configs.map(item => (
          <div key={item.id_configuracao} className='flex gap-2 w-full bg-white p-5 rounded-2xl'>
            <h1 className='font-medium capitalize'>{(item.chave).replace(/([A-Z])/g, ' $1').trim()}</h1>
            <h1>{item.valor}</h1>
          </div>
        )) : <h1>Nenhuma configução disponivel!</h1>}
      </div>
    </div>
  )
}
