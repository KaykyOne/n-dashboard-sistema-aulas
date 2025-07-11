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
  const { aulas: aulasMarcadas, loading: loadingAulas, setData, setInstrutor, instrutor, data, vagas: horariosVagos, deleteAula, buscarAulasInstrutor, alterarAula } = useAula();
  const { buscarInstrutores, instrutores, loading: loadingInstrutor } = useInstrutores();

  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState();

  const [aulaDrag, setAulaDrag] = useState();

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
    const horariosVagosFormatados = horariosVagos.map(item => {
      return { hora: item };
    });

    console.log(horariosVagosFormatados);
    return [...horariosVagosFormatados, ...aulasMarcadas];
  }, [horariosVagos, aulasMarcadas]);

  const confirmDeleteAula = async (id) => {
    if (!id) return;
    setModalVisible(true);
    setModalContent(
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tem certeza que deseja excluir esta aula?
        </h1>

        <img
          src="/imageDelete.svg"
          alt="Ícone de exclusão"
          className="max-w-[200px] w-full h-auto"
        />

        <div className="flex gap-3 mt-4">
          <Button
            variant="green"
            className="flex items-center gap-2"
            onClick={async () => {
              setModalVisible(false);
              await deleteAula(id);
            }}
          >
            <span className="material-icons">check_circle</span>
            Confirmar
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setModalVisible(false)}
          >
            <span className="material-icons">cancel</span>
            Cancelar
          </Button>
        </div>
      </div>

    )
    return;
  }

  useEffect(() => {
    if (!modalVisible && instrutor && data)
      buscarAulasInstrutor(instrutor, data);
  }, [modalVisible])

  useEffect(() => {
    buscarInstrutores();
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

  const dragIniti = (aula, index) => {
    setAulaDrag({ aula: aula, index: index });
  }

  const confirmDrop = (aula, index) => {
    setModalVisible(true);
    setModalContent(
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tem certeza que deseja troacar essas aulas?
        </h1>

        <img
          src="/imagemAlterar.svg"
          alt="Ícone de alteração"
          className="max-w-[200px] w-full h-auto"
        />

        <div className="flex gap-3 mt-4">
          <Button
            variant="green"
            className="flex items-center gap-2"
            onClick={async () => {
              setModalVisible(false);
              await dragDrop(aula, index);
            }}
          >
            <span className="material-icons">check_circle</span>
            Confirmar
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setModalVisible(false)}
          >
            <span className="material-icons">cancel</span>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  const dragDrop = async (aula, index) => {
    const newAulas = [...aulas];
    const aula1 = aula.hora;
    const aula2 = aulaDrag.aula.hora;
    const res = await alterarAula(aula.aula_id || 'vago', aula1, aulaDrag.aula.aula_id || 'vago', aula2)
    console.log(res);
    if (res === true) {
      aulaDrag.aula.hora = aula1;
      aula.hora = aula2
      newAulas[index] = aulaDrag.aula;
      newAulas[aulaDrag.index] = aula;

      setAulas(newAulas);
      setAulaDrag(null);
      if (!modalVisible && instrutor && data)
        buscarAulasInstrutor(instrutor, data);
      return;
    } else {
      setAulaDrag(null);
      return;
    }

  };


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

          <div className='flex flex-col'>
            <div className='grid grid-cols-5 p-3'>
              <h1 className='text-2xl font-bold'>Hora</h1>
              <h1 className='text-2xl font-bold'>Aluno</h1>
              <h1 className='text-2xl font-bold'>Veículo</h1>
              <h1 className='text-2xl font-bold'>Tipo</h1>
              <h1 className='text-2xl font-bold'>Ação</h1>
            </div>
            <div className='flex flex-col gap-1'>
              {aulasFiltradas.map((aula, index) => (
                aula.nome != null ?
                  <div key={aula.instrutor_id + aula.data + aula.hora + aula.aluno_id} className='grid grid-cols-5 text-start p-3 border border-gray-200 rounded-md' draggable
                    onDrop={() => confirmDrop(aula, index)} onDragStart={() => dragIniti(aula, index)} onDragOver={(e) => e.preventDefault()}>
                    <p>{aula.hora}</p>
                    <p>{aula.nome + " " + aula.sobrenome}</p>
                    <p>{aula.placa}</p>
                    <p className='font-black'>{aula.tipo}</p>
                    <Button
                      className={"w-full"}
                      variant={"destructive"}
                      onClick={() => confirmDeleteAula(aula.aula_id)}>
                      Excluir
                      <span className="material-icons">
                        delete
                      </span>
                    </Button>
                  </div>
                  :
                  <div key={`vaga-${aula.hora} `} className='grid grid-cols-4 text-start bg-red-700 text-white p-3 rounded-md' draggable
                    onDrop={() => confirmDrop(aula, index)} onDragStart={() => dragIniti(aula, index)} onDragOver={(e) => e.preventDefault()}>
                    <p>{aula.hora}</p>
                    <p>Vaga</p>
                    <p>Vaga</p>
                    <p>Vaga</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalVisible &&
        <Modal onClose={() => setModalVisible(false)}>
          {modalContent}
        </Modal>}

    </div>
  );
}