"use client"
import React, { useEffect, useState } from 'react'
import useAutoescola from '@/hooks/useAutoescola'

export default function ConfiguracoesPage() {
  const { getConfigs } = useAutoescola();
    const [configs, setConfigs] = useState([]);


  useEffect(() => {
    const searchConfigs = async() => {
      const res = await getConfigs();
      setConfigs(res || []);
    }

    searchConfigs();
  }, [])

  return (
    <div className='flex p-5'>
      <div className='flex flex-col gap-5'>
        {configs.length > 0 ? configs.map(item => (
          <div key={item.id_configuracao} className='flex gap-2'>
            <h1>{item.chave}</h1>
            <h1>{item.valor}</h1>
          </div>
        )) : <h1>Nenhuma configução disponivel!</h1>}
      </div>
    </div>
  )
}
