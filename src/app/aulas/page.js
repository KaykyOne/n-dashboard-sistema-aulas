"use client"
import React, { useEffect, useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datePicker';
import { Button } from '@/components/ui/button';
import useAula from '@/hooks/useAulas';
import useInstrutores from '@/hooks/useInstrutores';
import Loading from '@/components/Loading';


const opcoesAula = [
  {
    value: "Marcada",
    label: "Marcada"
  },
  {
    value: "Vaga",
    label: "Vaga"
  },
  {
    value: "Todas",
    label: "Todas",
  }
]

export default function AulasPage() {
  const { aulas: aulasMarcadas, loading: loadingAulas, setData, setInstrutor, instrutor, data, vagas: horariosVagos } = useAula();
  const {buscarInstrutores, instrutores, loading: loadingInstrutor} = useInstrutores();

  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [tipo, setTipo] = useState("");

  aulasFiltradas.sort((a, b) => {
    let hora1, hora2;
    if (a.hora == null) hora1 = a;
    else hora1 = a.hora;
    if (b.hora == null) hora2 = b;
    else hora2 = b.hora;

    const horaA = hora1.split(':').map(Number);
    const horaB = hora2.split(':').map(Number);

    const minutosA = horaA[0] * 60 + horaA[1];
    const minutosB = horaB[0] * 60 + horaB[1];

    return minutosA - minutosB;
  });

  const instrutoresOptions = instrutores.filter(i => i.atividade_instrutor == true).map((i) => ({
    value: i.instrutor_id.toString(),
    label: i.nome_instrutor,
  }));

  useEffect(() => {
    buscarInstrutores(1);
  }, [])

  useEffect(() => {
    setAulas([]);
    setAulasFiltradas([]);
    if (!loadingAulas) {
      const novasAulas = [...horariosVagos, ...aulasMarcadas];
      setAulas(novasAulas);
      setAulasFiltradas(novasAulas);
      setTipo(opcoesAula[2].value);
    }
  }, [loadingAulas]);


  useEffect(() => {
    let filtragem;
    if (tipo === "Vaga" || tipo === "Marcada") {
      if (tipo === "Vaga") filtragem = aulas.filter(aula => typeof aula == 'string');
      if (tipo === "Marcada") filtragem = aulas.filter(aula => typeof aula == 'object');
      setAulasFiltradas(filtragem);
    } else {
      setAulasFiltradas([...horariosVagos, ...aulasMarcadas]);
    }

  }, [tipo])

  return (
    <div className='relative'>
      {loadingAulas || loadingInstrutor && <Loading />}    
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

        <div className={`p-6 row-span-2 bg-white rounded-sm`}>
          {/* Barra de pesquisa */}
          <div className='grid grid-cols-5 align-middle gap-4 mb-3'>

            <Combobox
              options={instrutoresOptions}
              value={instrutor}
              onChange={setInstrutor}
              placeholder="Escolha o instrutor"
              className={'col-span-2'}
            />

            <DatePicker value={data} onChange={setData} className={'col-span-2 w-full'} />

            <Combobox
              options={opcoesAula}
              value={tipo}
              onChange={setTipo}
              placeholder="Escolha o tipo"
              className={'col-span-1'}
            />

          </div>


          <Table className={'text-2xl'}>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulasFiltradas.map((aula) => (
                aula.nome != null ?
                  <TableRow key={aula.instrutor_id + aula.data + aula.hora + aula.aluno_id}>
                    <TableCell>{aula.hora}</TableCell>
                    <TableCell>{aula.nome + " " + aula.sobrenome}</TableCell>
                    <TableCell>{aula.placa}</TableCell>
                    <TableCell className={'max-w-[60px]'}>
                      <Button
                        className={"w-full"}
                        variant={"destructive"}>
                        Excluir
                        <span className="material-icons">
                          delete
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  :
                  <TableRow key={aula} className={"bg-red-700 text-white cursor-pointer hover:bg-red-900"}>
                    <TableCell>{aula}</TableCell>
                    <TableCell>Vaga</TableCell>
                    <TableCell>Vaga</TableCell>
                    <TableCell className={'max-w-[60px]'}>
                      <Button
                        className={"w-full"}
                        variant={"alert"}>
                        Marcar Aula
                        <span className="material-icons">
                          touch_app
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


  );
}