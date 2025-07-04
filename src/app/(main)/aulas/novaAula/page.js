'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/datePicker'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'

import useInstrutores from "@/hooks/useInstrutores"
import useVeiculos from "@/hooks/useVeiculos"
import useAlunos from "@/hooks/useAlunos"
import useAula from '@/hooks/useAulas';
import { toast } from 'react-toastify'

export default function Page() {
  const { alunos, buscarAlunos, loading } = useAlunos()
  const { vagas, buscarHorariosLivres, InsertClass, testAulas, loading: loadingAulas } = useAula();
  const { instrutores, buscarInstrutores, loading: loadingInstrutor } = useInstrutores();
  const { buscarVeiculosTipo, loading: veiculosLoading, veiculos } = useVeiculos();

  // Estados de seleção
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [instrutorSelecionado, setInstrutorSelecionado] = useState('')
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null)
  const [dataSelecionada, setDataSelecionada] = useState()
  const [aluno, setAluno] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)

  const [horarioAvulso, setHorarioAvulso] = useState("")

  // Estados de liberação de campos
  const [liberaInstrutor, setLiberaInstrutor] = useState(false)
  const [liberaVeiculo, setLiberaVeiculo] = useState(false)
  const [liberaData, setLiberaData] = useState(false)
  const [liberaHorario, setLiberaHorario] = useState(false)
  const [liberarSubmit, setLiberarSubmit] = useState(false);

  // Busca
  const [searchForName, setSearchForName] = useState("")
  const [searchForCPF, setSearchForCPF] = useState("")

  // Alunos filtrados
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])

  //Modal
  const [modalContent, setModalContent] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const safeUpper = (str) => typeof str === 'string' ? str.toUpperCase() : ''

  const tipos = ['A', 'B', 'C', 'D', 'E']

  useEffect(() => {
    buscarAlunos()
    buscarInstrutores()
  }, [])

  // Primeiro filtro: apenas alunos ativos
  useEffect(() => {
    const ativos = alunos.filter(item => item.atividade === true)
    setUsuariosFiltrados(ativos)
  }, [alunos])

  // Segundo filtro: nome e cpf
  useEffect(() => {
    const ativos = alunos.filter(item => item.atividade === true)

    const filtrados = ativos.filter(item => {
      const nomeCompleto = `${item.nome} ${item.sobrenome}`.toLowerCase()
      const nomeMatch = nomeCompleto.includes(searchForName.toLowerCase())
      const cpfMatch = item.cpf.includes(searchForCPF)
      return nomeMatch && cpfMatch
    })

    setUsuariosFiltrados(filtrados)
  }, [searchForName, searchForCPF, alunos])

  // Liberação progressiva dos campos
  useEffect(() => {
    setInstrutorSelecionado('');
    setLiberaInstrutor(!!tipoSelecionado)
  }, [tipoSelecionado])

  useEffect(() => {
    setVeiculoSelecionado('');
    const buscarVeiculos = async () => {
      if (instrutorSelecionado) {
        await buscarVeiculosTipo(tipoSelecionado);
      }
    }
    buscarVeiculos();
    setLiberaVeiculo(!!instrutorSelecionado)
  }, [instrutorSelecionado])

  useEffect(() => {
    setDataSelecionada('');
    setLiberaData(!!veiculoSelecionado)
  }, [veiculoSelecionado])

  useEffect(() => {
    setHorarioSelecionado('');
    const buscarVagos = async () => {
      if (dataSelecionada) {
        await buscarHorariosLivres(instrutorSelecionado, veiculoSelecionado, dataSelecionada);
      }
    }
    buscarVagos();
    setLiberaHorario(!!dataSelecionada)
  }, [dataSelecionada])

  useEffect(() => {
    if (horarioSelecionado && horarioAvulso) {
      setHorarioSelecionado('');
      setHorarioAvulso('');
      toast.warn("Escolha somente um tipo de horário!")
    }
    setLiberarSubmit(!!horarioAvulso || !!horarioSelecionado);
  }, [horarioAvulso, horarioSelecionado]);

  const handleTipoClick = (tipo) => {
    setTipoSelecionado(prev => (prev === tipo ? null : tipo))
  }

  const handleConfirm = async () => {

    const res = await testAulas(aluno.usuario_id, dataSelecionada, tipoSelecionado, 3, []);
    if (res) {
      setModalContent(res || '');
      setModalVisible(true);
    }
    else {
      await confirmAula();
    }
  };

  const confirmAula = async () => {
    const aula = {
      instrutor_id: instrutorSelecionado,
      aluno_id: aluno.usuario_id,
      data: dataSelecionada,
      tipo: tipoSelecionado,
      hora: horarioSelecionado ? horarioSelecionado : horarioAvulso,
      veiculo_id: veiculoSelecionado,
      autoescola_id: 0,
      marcada_por: 3,
      configuracoes: [],
    };

    await InsertClass(aula);
    setModalVisible(false);
    setHorarioSelecionado('');
    await buscarVagos();
  }

  const buscarVagos = async () => {
    if (dataSelecionada) {
      await buscarHorariosLivres(instrutorSelecionado, veiculoSelecionado, dataSelecionada);
    }
  }

  const selecionarAluno = (data) => {
    setAluno(data)
    setDataSelecionada(null);
    setHorarioAvulso('');
    setHorarioSelecionado('');
    setVeiculoSelecionado('');
    setInstrutorSelecionado('');
    setTipoSelecionado('');
  }

  const instrutoresOptions = instrutores.filter(i => i.atividade_instrutor == true).map((i) => ({
    value: i.instrutor_id.toString(),
    label: i.nome_instrutor,
  }));

  return (
    <div className='flex flex-col'>
      {loading || loadingInstrutor || veiculosLoading || loadingAulas && <Loading />}
      <h1 className='text-4xl font-bold ml-4'>Marcar Aulas</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        {/* Formulário */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl p-2">
          <div>
            <h2 className="font-semibold">Aluno Selecionado:</h2>
            {aluno.nome ? <h1 className="bg-white capitalize text-black font-bold text-2xl">{aluno.nome + " " + aluno.sobrenome}</h1> : <h1 className='bg-red-900 text-white text-2xl capitalize font-bold p-1 rounded-md flex items-center gap-1'><span className="material-icons">
              highlight_off
            </span> Não Selecionado</h1>}
          </div>

          <div>
            <label className="font-semibold">Tipo da aula:</label>
            <div className="flex gap-4 mt-2 flex-wrap">
              {tipos.map((tipo) => (
                <div className="flex items-center gap-1" key={tipo}>
                  <input
                    id={`type-${tipo}`}
                    name="typeA"
                    type="checkbox"
                    checked={tipoSelecionado === tipo}
                    onChange={() => handleTipoClick(tipo)}
                  />
                  <label htmlFor={`type-${tipo}`}>{tipo}</label>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col'>
            <h1 className='font-semibold'>Instrutor:</h1>
            <Combobox
              options={instrutoresOptions}
              placeholder='Instrutor'
              disabled={!liberaInstrutor}
              onChange={setInstrutorSelecionado}
              value={instrutorSelecionado}
            />
          </div>

          <div className='flex flex-col'>
            <h1 className='font-semibold'>Veiculo:</h1>
            <Combobox
              options={veiculos}
              placeholder='Veiculo'
              disabled={!liberaVeiculo}
              onChange={setVeiculoSelecionado}
              value={veiculoSelecionado}
            />
          </div>

          <div className='flex flex-col'>
            <h1 className='font-semibold'>Data:</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              <DatePicker
                value={dataSelecionada}
                disabled={!liberaData}
                onChange={setDataSelecionada}
                className={'flex-1 col-span-2'}
              />
              <Button onClick={() => setDataSelecionada(new Date())} className={'flex-1 col-span-1'} disabled={!liberaData}>
                Hoje
                <span className="material-icons">
                  today
                </span>
              </Button>
            </div>
          </div>

          <div className='flex gap-2'>
            <div className='flex-1'>
              <h1 className='font-semibold'>Horário:</h1>
              <Combobox
                options={vagas}
                placeholder='Horário '
                disabled={!liberaHorario}
                onChange={setHorarioSelecionado}
                value={horarioSelecionado}
              />  
            </div>
            <div className='flex flex-col'>
              <h1 className='font-semibold'>Horário Avulso:</h1>
              <Input className="bg-white" value={horarioAvulso} type="time" onChange={(e) => setHorarioAvulso(e.target.value)} disabled={!liberaHorario} />
            </div>
          </div>

          <Button disabled={!liberarSubmit} className="mt-4" onClick={() => handleConfirm()}>
            Confirmar
            <span className="material-icons">
              check
            </span>
          </Button>
        </div>

        {/* Lista de alunos */}
        <div className='flex flex-col p-2 bg-white rounded-2xl'>
          <h1 className='text-2xl font-medium mb-2'>Selecionar Aluno:</h1>
          <Input
            placeholder="Buscar usuário por Nome..."
            value={searchForName}
            onChange={(e) => setSearchForName(e.target.value)}
            className="mb-4 w-full"
          />
          <Input
            placeholder="Buscar usuário por CPF..."
            value={searchForCPF}
            onChange={(e) => setSearchForCPF(e.target.value)}
            className="mb-4 w-full"
          />
          <div className="flex-1 max-h-[400px] overflow-auto">
            <div className='flex flex-col gap-2'>
              <div className='grid grid-cols-4 p-3'>
                <h1 className='text-2xl font-bold'>Nome</h1>
                <h1 className='text-2xl font-bold'>CPF</h1>
                <h1 className='text-2xl font-bold'>Categoria</h1>
                <h1 className='text-2xl font-bold'>Ação</h1>
              </div>
              <div className='flex flex-col gap-1'>
                {usuariosFiltrados.map((user) => (
                  <div key={user.usuario_id} className='grid grid-cols-4 text-start p-3 border border-gray-200 rounded-md'>
                    <p className='capitalize'>{user.nome + ' ' + user.sobrenome}</p>
                    <p>{user.cpf.length > 11 ? "inviável" : user.cpf}</p>
                    <p>{safeUpper(user?.categoria_pretendida)}</p>
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => selecionarAluno(user)}
                    >
                      Selecionar
                      <span className="material-icons">
                        touch_app
                      </span>
                    </Button>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalVisible &&
        <Modal onClose={() => setModalVisible(false)}>
          <div className='flex gap-2 items-center justify-center'>

            <div className='flex flex-col justify-center items-center gap-2 w-full'>
              <span className="material-icons !text-9xl">
                error
              </span>
              <h1>{modalContent}</h1>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <Button onClick={() => confirmAula()} className={'w-full'}>Confirmar Aula</Button>
                <Button onClick={() => setModalVisible(false)} className={'w-full'}>Cancelar</Button>
              </div>
            </div>
          </div>

        </Modal>
      }
    </div>
  )
}
