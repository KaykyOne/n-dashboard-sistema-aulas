import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function FormNovoAluno() {
  return (
    <div className='justify-center w-full align-middle grid grid-cols-3 p-5'>
        <div className='justify-start col-span-2 p-2'>
            <h1 className='font-black text-4xl'>Cadastrar Aluno</h1>
            <h1>Nome:</h1>
            <Input placeholder='nome..'/>
            <h1>Sobrenome:</h1>
            <Input placeholder='sobrenome..'/>
            <h1>CPF:</h1>
            <Input placeholder='000.000.000-00'/>
            <h1>Telefone:</h1>
            <Input placeholder='(00)00000-0000'/>
            <Button className='mt-3'>
                Cadastrar
            </Button>
            <h1>Categoria:</h1>
            <div className='flex'>
                <input type='checkbox'/>
            </div>

        </div>       
        <div className='bg-[#6F0A59] rounded-md'>

        </div>
    </div>
  )
}
