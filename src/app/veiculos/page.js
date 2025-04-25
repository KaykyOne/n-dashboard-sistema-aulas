"use client"
import { Combobox } from '@/components/ui/combobox'
import React from 'react'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react';
import { Input } from '@/components/ui/input';


export default function VeiculoPage() {
  const [search, setSearch] = useState("");

  const veiculos = [
    { value: 1, label: "zasd", tipo: "A" },
    { value: 2, label: "ascas", tipo: "B" },
    { value: 3, label: "asdwa", tipo: "C" },
    { value: 4, label: "asdwa", tipo: "C" },
    { value: 5, label: "asdwa", tipo: "C" },
    { value: 6, label: "asdwa", tipo: "C" },
    { value: 7, label: "asdwa", tipo: "C" },
    { value: 8, label: "asdwa", tipo: "C" },
  ]

  const instrutores = [
    { value: 1, label: "asdasd" },
    { value: 2, label: "Moawewto" },
    { value: 3, label: "Cwqeqweaminhão" },
    { value: 4, label: "Cwqeqweaminhão" },
    { value: 5, label: "Cwqeqweaminhão" },
    { value: 6, label: "Cwqeqweaminhão" },
    { value: 7, label: "Cwqeqweaminhão" },
  ]

  const veiculosFiltrados = veiculos.filter((veiculo) =>
    veiculo.label.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className='flex flex-col gap-4 text-[#6F0A59] p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>

        {/* Caixas de totais */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(A)</strong>:</h3>
            <h1 className='font-bold text-6xl'>2</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(B)</strong>:</h3>
            <h1 className='font-bold text-6xl'>3</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(C)</strong>:</h3>
            <h1 className='font-bold text-6xl'>0</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(D)</strong>:</h3>
            <h1 className='font-bold text-6xl'>1</h1>
          </div>
          <div className='bg-white p-3 col-span-1 sm:col-span-2 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(E)</strong>:</h3>
            <h1 className='font-bold text-6xl'>1</h1>
          </div>
        </div>

        {/* Seção de responsável */}
        <div className='bg-white flex flex-col p-3 gap-4 rounded-sm'>
          <h3 className='font-bold text-2xl'>Responsável(s) por Veículo:</h3>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col flex-1 gap-2'>
              <p>Veículo:</p>
              <Combobox options={veiculos} placeholder='Escolha o Veículo' />
              <p>Instrutor:</p>
              <Combobox options={instrutores} placeholder='Escolha o Instrutor' />
              <Button className="mt-4">
                Adicionar
              </Button>
            </div>
            <div className='flex flex-col flex-1 overflow-x-auto border-gray-200 border-solid border-2 w-full max-h-[200px] rounded-sm'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instrutor ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Excluir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrutores.map((instrutor) => (
                    <TableRow key={instrutor.value}>
                      <TableCell>{instrutor.value}</TableCell>
                      <TableCell>{instrutor.label}</TableCell>
                      <TableCell><Button className={"bg-red-800"}>Excluir</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="p-6 row-span-2 bg-white rounded-sm">
          {/* Barra de pesquisa */}
          <Input
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full"
          />

          {/* Tabela */}
          <div className='flex-1 max-h-[500px] overflow-auto'>
            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {veiculosFiltrados.map((veiculo) => (
                  <TableRow key={veiculo.value}>
                    <TableCell>{veiculo.value}</TableCell>
                    <TableCell>{veiculo.label}</TableCell>
                    <TableCell>{veiculo.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
