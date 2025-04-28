"use client"
import React from 'react'

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datePicker';

const aulas = [
  { id: 1, data: "27/08/2025", hora: "10:20", aluno_id: 30, instrutor_id: 3 },
  { id: 2, data: "28/08/2025", hora: "10:20", aluno_id: 40, instrutor_id: 3 },
  { id: 3, data: "29/08/2025", hora: "10:20", aluno_id: 50, instrutor_id: 4 },
];

const opcoes = [
  { value: "carro", label: "Carro" },
  { value: "moto", label: "Moto" },
  { value: "caminhao", label: "Caminhão" },
]

export default function AulasPage() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const aulasFiltradas = aulas.filter((aula) => {
    aula.data.toLowerCase().includes(search.toLowerCase())
  }
  );

  return (
    <div className="grid grid-cols-1 gap-4">

      <div className="row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="row-span-1 grid grid-cols-1 gap-4" >
          <div className="p-6 row-span-1 bg-white rounded-sm" >
            <h1>Número de <strong>Aulas</strong> Marcadas Hoje:</h1>
            <h1 className="font-bold text-7xl">400</h1>
          </div>
          <div className="p-6 row-span-1 bg-white rounded-sm" >
            <h1>Meta miníma de aulas:</h1>
            <h1 className="font-bold text-7xl">80</h1>
          </div>
        </div>

        <div className="p-6 row-span-1 bg-white rounded-sm" >
          <h1>Média de aulas marcadas por dia:</h1>
          <h1 className="font-bold text-9xl">25</h1>
          <div className="border-2 border-solid border-black">
            <div style={{ width: "80%" }} className="bottom-0 h-5 bg-[#6F0A59]" />
          </div>
        </div>
      </div>

      <div className="p-6 row-span-2 bg-white rounded-sm">
        {/* Barra de pesquisa */}
        <div className='grid grid-cols-5 align-middle gap-4 mb-3'>
          <Combobox
            options={opcoes}
            value={tipo}
            onChange={setTipo}
            placeholder="Escolha o tipo"
            className={'col-span-2'}
          />

          <Combobox
            options={opcoes}
            value={tipo}
            onChange={setTipo}
            placeholder="Escolha o instrutor"
            className={'col-span-2'}
          />

          <DatePicker value={dataSelecionada} onChange={setDataSelecionada} />
        </div>


        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Instrutor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aulas.map((aula) => (
              <TableRow key={aula.id}>
                <TableCell>{aula.id}</TableCell>
                <TableCell>{aula.data}</TableCell>
                <TableCell>{aula.hora}</TableCell>
                <TableCell key={aula.aluno_id}><button>asd</button></TableCell>
                <TableCell key={aula.instrutor_id}><button>asd</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}