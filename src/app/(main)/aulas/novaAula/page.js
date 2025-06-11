'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'
import { DatePicker } from '@/components/ui/datePicker'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import useInstrutores from "@/hooks/useInstrutores"
import useVeiculos from "@/hooks/useVeiculos"
import useAlunos from "@/hooks/useAlunos"
import useAula from '@/hooks/useAulas';
import { toast } from 'react-toastify'

export default function Page() {
  const { alunos, buscarAlunos, loading } = useAlunos()
  const { vagas, buscarHorariosLivres, InsertClass } = useAula();
  const { instrutores, buscarInstrutores, loading: loadingInstrutor } = useInstrutores();
  const { buscarVeiculosTipo, loading: veiculosLoading, veiculos } = useVeiculos();

  // Estados de seleção
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [instrutorSelecionado, setInstrutorSelecionado] = useState('')
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null)
  const [dataSelecionada, setDataSelecionada] = useState(null)
  const [aluno, setAluno] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null)

  const [horarioAvulso, setHorarioAvulso] = useState("")

  // Estados de liberação de campos
  const [liberaInstrutor, setLiberaInstrutor] = useState(false)
  const [liberaVeiculo, setLiberaVeiculo] = useState(false)
  const [liberaData, setLiberaData] = useState(false)
  const [liberaHorario, setLiberaHorario] = useState(false)

  // Busca
  const [searchForName, setSearchForName] = useState("")
  const [searchForCPF, setSearchForCPF] = useState("")

  // Alunos filtrados
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])

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

  const handleTipoClick = (tipo) => {
    setTipoSelecionado(prev => (prev === tipo ? null : tipo))
  }

  const handleConfirm = async () => {
    // Inserir a aula com base no tipo de usuário
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
    setHorarioSelecionado('');
    await buscarVagos();

  };

  const buscarVagos = async () => {
    if (dataSelecionada) {
      await buscarHorariosLivres(instrutorSelecionado, veiculoSelecionado, dataSelecionada);
    }
  }

  const instrutoresOptions = instrutores.filter(i => i.atividade_instrutor == true).map((i) => ({
    value: i.instrutor_id.toString(),
    label: i.nome_instrutor,
  }));

  return (
    <div className='flex flex-col'>
      <h1 className='text-4xl font-bold ml-4'>Marcar Aulas</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        {/* Formulário */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl p-2">
          <div>
            <h2 className="font-semibold">Aluno Selecionado:</h2>
            <h1 className="bg-white capitalize text-black font-bold text-2xl">{`${aluno.nome || 'Não'} ${aluno.sobrenome || 'Definido'}`}</h1>
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
            <DatePicker
              value={dataSelecionada}
              disabled={!liberaData}
              onChange={setDataSelecionada}
            />
          </div>

          <div className='flex gap-2'>
            <div className='w-full'>
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
              <Input className="bg-white" value={horarioAvulso} onChange={(e) => setHorarioAvulso(e.target.value)} disabled={!liberaHorario} />
            </div>
          </div>

          <Button className="mt-4" onClick={() => handleConfirm()}>Confirmar</Button>
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
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((user) => (
                  <TableRow key={user.usuario_id}>
                    <TableCell className="capitalize">{user.nome} {user.sobrenome}</TableCell>
                    <TableCell>{user.cpf.length > 11 ? "inviável" : user.cpf}</TableCell>
                    <TableCell>{user.categoria_pretendida.toUpperCase()}</TableCell>
                    <TableCell>
                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() => setAluno(user)}
                      >
                        Selecionar
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
    </div>
  )
}
