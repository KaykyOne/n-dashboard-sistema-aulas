import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function Loading() {
  const route = useRouter();
  return (
    <div className="flex flex-col absolute top-0 left-0 justify-center items-center bg-background z-50 h-full w-full gap-1">
      <div className='gap-3 items-center flex flex-col'>
        <div className="w-10 h-10 border-4 border-t-fuchsia-800 border-gray-300 rounded-full animate-spin"></div>
        <h1 className='text-primary font-medium text-3xl mt-3'>Aguarde...</h1>
        <Button className={'w-full'} onClick={() => route.push('/inicio')}>
          Cancelar
          <span className="material-icons">
            close
          </span>
        </Button>
      </div>
    </div>
  )
}
