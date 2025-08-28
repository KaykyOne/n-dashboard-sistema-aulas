"use client"
import React, { useEffect, useState, useMemo } from 'react'

import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datePicker';
import { Button } from '@/components/ui/button';
import useInstrutores from '@/hooks/useInstrutores';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { addMinutes, format } from 'date-fns';

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

export default function ListAulasInstrutor({
  dragIniti,
  dragDrop,
  confirmDrop,
  modalVisibleDrag,
  modalContentDrag,
  aulasMarcadas,
  horariosVagos,
  loadingAulas,
  setData,
  setInstrutor,
  instrutor,
  data,
  deleteAula,
  buscarAulasInstrutor,
  autoescola_id,
}) {
  const { buscarInstrutores, instrutores, loading: loadingInstrutor, inserirExeção, buscarExecoesDia, deletarExecao } = useInstrutores();

  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [horariosBloqueados, setHorariosBloqueados] = useState([]);
  const [execoes, setExecoes] = useState([]);


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

  useEffect(() => {
    if (!instrutor || !data) return;
    const buscarExecoes = async () => {
      const res = await buscarExecoesDia(instrutor, data);
      setExecoes(res || []);
    }
    buscarExecoes();
  }, [instrutor, data])



  const atretrelarHorario = (a, hora) => {
    if (a) {
      setHorariosBloqueados((prev) => [...prev, hora]);
    } else {
      setHorariosBloqueados((prev) =>
        prev.filter((item) => item !== hora) // remove o horário
      );
    }
  };

  const desmarcarCheckboxes = () => {
    setHorariosBloqueados([])
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
  };

  function horaParaMinutos(horaStr) {
    const [h, m] = horaStr.split(":").map(Number);
    return h * 60 + m;
  };

  const handleExcluirExecao = async (execao_id) => {
    await deletarExecao(execao_id);
    await buscarExecoes();
  }

  const buscarExecoes = async () => {
    const res = await buscarExecoesDia(instrutor, data);
    setExecoes(res || []);
  }

  const confirmHorariosBloqueados = async () => {
    let menor;
    let maior

    if (horariosBloqueados.length > 1) {
      menor = horariosBloqueados.reduce((menor, atual) => {
        return horaParaMinutos(atual) < horaParaMinutos(menor) ? atual : menor;
      });
      maior = horariosBloqueados.reduce((maior, atual) => {
        return horaParaMinutos(atual) > horaParaMinutos(maior) ? atual : maior;
      });
    } else if (horariosBloqueados.length == 1) {
      menor = horariosBloqueados[0];
      maior = horariosBloqueados[0];
    }

    await inserirExeção(instrutor, data, menor, maior);
    desmarcarCheckboxes();
    await buscarExecoes();
  }

  return (
    <div className='flex'>
      <div className='relative flex-1'>
        {(loadingAulas || loadingInstrutor) && <Loading />}
        <div className="grid grid-cols-1 gap-4 ">
          {horariosBloqueados.length > 0 &&
            <div className='flex flex-col gap-2 w-full'>
              <Button variant={'green'} onClick={() => confirmHorariosBloqueados()}>Salvar</Button>
              <Button variant={'alert'} onClick={() => desmarcarCheckboxes()}>Cancelar</Button>
            </div>
          }
          <div className={`p-6 row-span-2 bg-white rounded-sm anim-hover card`}>
            {/* Barra de pesquisa */}
            <div className='grid grid-cols-1 lg:grid-cols-5 align-middle gap-4 mb-3'>

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
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-3'>
                <h1 className='text-2xl font-bold'>Hora</h1>
                <h1 className='text-2xl font-bold'>Aluno</h1>
                <h1 className='text-2xl font-bold hidden md:block'>Veículo</h1>
                <h1 className='text-2xl font-bold hidden md:block'>Tipo</h1>
                <h1 className='text-2xl font-bold hidden sm:block'>Ação</h1>
              </div>
              <div className='flex flex-col gap-1'>
                {aulasFiltradas.map((aula, index) => (
                  aula.nome != null ?
                    <div key={aula.instrutor_id + aula.data + aula.hora + aula.aluno_id} className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 text-start p-3 border border-gray-200 rounded-md' draggable
                      onDrop={() => confirmDrop(aula, index)} onDragStart={() => dragIniti(aula, index)} onDragOver={(e) => e.preventDefault()}>
                      <p>{aula.hora}</p>
                      <p>{aula.nome + " " + aula.sobrenome}</p>

                      <p className='hidden md:block'>{aula.placa}</p>
                      <p className='font-black hidden md:block'>{aula.tipo}</p>
                      {aula.autoescola_id == autoescola_id ?
                        <Button
                          className={"w-full hidden sm:block"}
                          variant={"destructive"}
                          onClick={() => confirmDeleteAula(aula.aula_id)}>
                          Excluir
                          <span className="material-icons">
                            delete
                          </span>
                        </Button> : 
                        <div className='hidden sm:block'>Outra autoescola: {aula.autoescola_id}</div>}

                    </div>
                    :
                    <div key={`vaga-${aula.hora} ${index}`} className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 text-start bg-red-700 text-white p-3 rounded-md' draggable
                      onDrop={() => confirmDrop(aula, index)} onDragStart={() => dragIniti(aula, index)} onDragOver={(e) => e.preventDefault()}>
                      <p>{aula.hora}</p>
                      <p>Vaga</p>
                      <p className='hidden md:block'>Vaga</p>
                      <div className='gap-1 items-center hidden md:flex'>
                        <input onClick={(a) => atretrelarHorario(a.target.checked, aula.hora)} id={`checkBloqueio${aula.hora}`} type='checkbox' />
                        <label htmlFor={`checkBloqueio${aula.hora}`}>Bloquear horário</label>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <div className='flex flex-col'>
              {execoes.length > 0 && (
                <div className="flex flex-col gap-4 mt-4 w-full">
                  <div className='flex flex-col'>
                    <h1 className='text-3xl font-bold'>Bloqueios desse dia:</h1>
                    <h2>Isso serve para impedir que você ou alunos marquem aulas em horarios que não podem!</h2>
                  </div>
                  {execoes.map((item) => (
                    <div
                      key={item.execao_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border  border-gray-300 p-4 rounded-xl shadow-md"
                    >
                      <div className="flex flex-col text-gray-700">
                        <span><strong>Início:</strong> {item.hora_inicio}</span>
                        <span><strong>Fim:</strong> {item.hora_fim}</span>
                      </div>

                      <Button
                        type={3}
                        onClick={() => handleExcluirExecao(item.execao_id)} // substitua pela sua função
                        className="self-end sm:self-auto"
                      >
                        Excluir
                        <span className="material-icons">delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>


      {(modalVisible || modalVisibleDrag) &&
        <Modal onClose={() => setModalVisible(false)}>
          {modalContent || modalContentDrag}
        </Modal>}
    </div>
  );
}