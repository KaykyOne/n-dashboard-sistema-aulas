"use client"
import { Combobox } from '@/components/ui/combobox'
import React, { useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const veiculos = [
  { veiculo_id: 1, placa: "ABC1234", modelo: "Onix", tipo: "A", disponibilidade: true },
  { veiculo_id: 2, placa: "DEF5678", modelo: "HB20", tipo: "B", disponibilidade: false },
  { veiculo_id: 3, placa: "GHI9012", modelo: "Kwid", tipo: "A", disponibilidade: true },
  { veiculo_id: 4, placa: "JKL3456", modelo: "Corolla", tipo: "B", disponibilidade: true },
  { veiculo_id: 5, placa: "MNO7890", modelo: "Civic", tipo: "B", disponibilidade: false },
  { veiculo_id: 6, placa: "PQR1234", modelo: "Uno", tipo: "A", disponibilidade: true },
  { veiculo_id: 7, placa: "STU5678", modelo: "Gol", tipo: "E", disponibilidade: false },
];

const veiculosOptions = veiculos.map((v) => ({
  value: v.veiculo_id.toString(), // ou pode ser a placa se quiser
  label: `${v.modelo} - ${v.placa}`, // o que aparece na lista
}))


const instrutores = [
  { instrutor_id: 1, nome_instrutor: "João Silva", tipo_instrutor: "A", atividade_instrutor: true },
  { instrutor_id: 2, nome_instrutor: "Maria Souza", tipo_instrutor: "B", atividade_instrutor: false },
  { instrutor_id: 3, nome_instrutor: "Carlos Lima", tipo_instrutor: "AB", atividade_instrutor: true },
  { instrutor_id: 4, nome_instrutor: "Fernanda Alves", tipo_instrutor: "A", atividade_instrutor: true },
  { instrutor_id: 5, nome_instrutor: "Pedro Henrique", tipo_instrutor: "B", atividade_instrutor: false },
];

const instrutoresOptions = instrutores.map((i) => ({
  value: i.instrutor_id.toString(),
  label: i.nome_instrutor,
}))

export default function VeiculoPage() {
  const [search, setSearch] = useState("");
  const [veiculosFiltrados, setVeiculosFiltrados] = useState(veiculos);

  const filtrarVeiculos = () => {
    const veiculosFiltro = veiculosFiltrados.filter((veiculo) =>
      veiculo.placa.toLowerCase().includes(search.toLowerCase())
    );
    setVeiculosFiltrados(veiculosFiltro);
  }

  useEffect(() => {
    if (search == "") {
      setVeiculosFiltrados(veiculos);
      return;
    }
    filtrarVeiculos();
  }, [search])

  const handleAlterState = (veiculo) => {
    veiculo.disponibilidade = !veiculo.disponibilidade;
    filtrarVeiculos();
  }

  return (
    <div className='flex flex-col gap-4 text-[#6F0A59]'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>

        {/* Caixas de totais */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(A)</strong>:</h3>
            <h1 className='font-bold text-6xl'>{veiculos.filter((veiculo) => veiculo.tipo.toLocaleLowerCase() === "a").length}</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(B)</strong>:</h3>
            <h1 className='font-bold text-6xl'>{veiculos.filter((veiculo) => veiculo.tipo.toLocaleLowerCase() === "b").length}</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(C)</strong>:</h3>
            <h1 className='font-bold text-6xl'>{veiculos.filter((veiculo) => veiculo.tipo.toLocaleLowerCase() === "c").length}</h1>
          </div>
          <div className='bg-white p-3 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(D)</strong>:</h3>
            <h1 className='font-bold text-6xl'>{veiculos.filter((veiculo) => veiculo.tipo.toLocaleLowerCase() === "d").length}</h1>
          </div>
          <div className='bg-white p-3 col-span-1 sm:col-span-2 rounded-sm'>
            <h3 className='font-medium'>Total de Veículos <strong>(E)</strong>:</h3>
            <h1 className='font-bold text-6xl'>{veiculos.filter((veiculo) => veiculo.tipo.toLocaleLowerCase() === "e").length}</h1>
          </div>
        </div>

        {/* Seção de responsável */}
        <div className='bg-white flex flex-col p-3 gap-4 rounded-sm'>
          <h3 className='font-bold text-2xl'>Responsável(s) por Veículo:</h3>
          <div className='flex flex-col :flex-row gap-4'>
            <div className='flex flex-col flex-1 gap-2'>
              <p>Veículo:</p>
              <Combobox options={veiculosOptions} value={"placa"} placeholder='Escolha o Veículo' />
              <p>Instrutor:</p>
              <Combobox options={instrutoresOptions} placeholder='Escolha o Instrutor' />
              <Button className="mt-4">
                Adicionar Responsável
                <span className="material-icons">
                  add
                </span>
              </Button>
            </div>
            <div className='flex flex-col flex-1 overflow-x-auto border-gray-200 border-solid border-2 w-full max-h-[200px] rounded-sm'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instrutor ID</TableHead>
                    <TableHead>Nome Instrutor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrutores.map((instrutor) => (
                    <TableRow key={instrutor.instrutor_id}>
                      <TableCell>{instrutor.instrutor_id}</TableCell>
                      <TableCell>{instrutor.nome_instrutor}</TableCell>
                      <TableCell><Button variant={'destructive'}>Excluir</Button></TableCell>
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
            placeholder="Buscar Veículo por Placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full"
          />

          {/* Tabela */}
          <div className='flex-1 h-[300px] overflow-auto'>
            <Table className="table-fixed w-full">

              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Disponibilidade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {veiculosFiltrados.map((veiculo) => (
                  <TableRow key={veiculo.veiculo_id}>
                    <TableCell className={'font-bold'}>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell>{veiculo.tipo}</TableCell>
                    <TableCell>
                      <Button
                        className={'w-full'}
                        variant={veiculo.disponibilidade ? "green" : "destructive"}
                        onClick={() => handleAlterState(veiculo)}>
                        {veiculo.disponibilidade ? "Ativo" : "Inativo"}
                      </Button>
                    </TableCell>
                    <TableCell className={'max-w-[100px]'}>
                      <Button className={'w-full'} variant={'alert'}>
                        Editar
                        <span className="material-icons">
                          edit
                        </span>
                      </Button>
                    </TableCell>
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
