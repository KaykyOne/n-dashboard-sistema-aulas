"use client"
import React, { useEffect, useState, useMemo } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datePicker';
import { Button } from '@/components/ui/button';
import useAula from '@/hooks/useAulas';
import useInstrutores from '@/hooks/useInstrutores';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';

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
  const { aulas: aulasMarcadas, loading: loadingAulas, setData, setInstrutor, instrutor, data, vagas: horariosVagos, deleteAula, buscarAulasInstrutor } = useAula();
  const { buscarInstrutores, instrutores, loading: loadingInstrutor } = useInstrutores();

  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState();

  const instrutoresOptions = useMemo(() => {
    return instrutores
      .filter(i => i.atividade_instrutor === true)
      .map(i => ({
        value: i.instrutor_id.toString(),
        label: i.nome_instrutor,
      }));
  }, [instrutores]);

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

  const novasAulas = useMemo(() => {
    return [...horariosVagos, ...aulasMarcadas];
  }, [horariosVagos, aulasMarcadas]);

  const confirmDeleteAula = async (id) => {
    if (!id) return;
    setModalVisible(true);
    setModalContent(
      <div className='flex flex-col gap-3 text-center justify-center items-center'>
        <h1 className='text-2xl mb-2'>Deseja realmente excluir essa aula?</h1>
        <img
          src={`/imageDelete.png`}
          alt="logo da empresa"
          className="w-auto h-auto" />
        <div className='flex gap-2'>
          <Button variant={'green'} onClick={() => {
            setModalVisible(false);
            deleteAula(id);
          }}>
            Confirmar
            <span className="material-icons">
              check_circle
            </span>
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => setModalVisible(false)}>
            Cancelar
            <span className="material-icons">
              cancel
            </span>
          </Button>
        </div>
      </div>
    )
    return;
  }

  const createAula = async (hora) => {
    setModalContent(
      <div className='flex flex-col gap-3 text-center justify-center items-center'>
        <h1 className='text-2xl mb-2'>Deseja realmente excluir essa aula?</h1>
        <img
          src={`/imageDelete.png`}
          alt="logo da empresa"
          className="w-auto h-auto" />
        <div className='flex gap-2'>
          <Button variant={'green'} onClick={() => {
            setModalVisible(false);
            deleteAula(id);
          }}>
            Confirmar
            <span className="material-icons">
              check_circle
            </span>
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => setModalVisible(false)}>
            Cancelar
            <span className="material-icons">
              cancel
            </span>
          </Button>
        </div>
      </div>
    );
    setModalVisible(true);
  }

  useEffect(() => {
    if (!modalVisible && instrutor && data)
      buscarAulasInstrutor(instrutor, data);
  }, [modalVisible])

  useEffect(() => {
    buscarInstrutores(1);
  }, [])

  useEffect(() => {
    setAulas(novasAulas);
    setAulasFiltradas(novasAulas);
    setTipo(opcoesAula[2].value);
  }, [novasAulas]);


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
      {(loadingAulas || loadingInstrutor) && <Loading />}
      <div className="grid grid-cols-1 gap-4">

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
                    <TableCell className={'capitalize'}>{aula.nome + " " + aula.sobrenome}</TableCell>
                    <TableCell>{aula.placa}</TableCell>
                    <TableCell className={'max-w-[60px]'}>
                      <Button
                        className={"w-full"}
                        variant={"destructive"}
                        onClick={() => confirmDeleteAula(aula.aula_id)}>
                        Excluir
                        <span className="material-icons">
                          delete
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  :
                  <TableRow key={`vaga-${aula} `} className={"bg-red-700 text-white cursor-pointer hover:bg-red-900"}>
                    <TableCell>{aula}</TableCell>
                    <TableCell>Vaga</TableCell>
                    <TableCell>Vaga</TableCell>
                    <TableCell className={'max-w-[60px]'}>
                      <Button
                        className={"w-full"}
                        variant={"alert"}
                        onClick={() => createAula(aula)}
                      >
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

      {modalVisible &&
        <Modal onClose={() => setModalVisible(false)}>
          {modalContent}
        </Modal>}

    </div>
  );
}