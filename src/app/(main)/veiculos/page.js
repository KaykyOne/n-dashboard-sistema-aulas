"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useVeiculos from '@/hooks/useVeiculos'
import useInstrutores from '@/hooks/useInstrutores'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import { Combobox } from '@/components/ui/combobox'

export default function VeiculoPage() {
  const { veiculos, buscarVeiculosTipo, criarVeiculo, editarVeiculo, atualizarDisponibilidade, buscarTodosOsVeiculos, adicionarRelacionamento, buscarRelacionamentos, excluirRelacionamento, instrutoresRelacionados, loading } = useVeiculos();
  const { buscarInstrutores, instrutores } = useInstrutores();

  const [search, setSearch] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState({
    veiculo_id: null,
    placa: "",
    modelo: "",
    categoria: ""
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [instrutorSelecionado, setInstrutorSelecionado] = useState("");

  const filtrar = veiculos.filter((veiculo) =>
    veiculo.placa.toLowerCase().includes(search.toLowerCase())
  ) || [];

  useEffect(() => {
    buscarTodosOsVeiculos(); // pega todos os tipos
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.placa || !formData.modelo || !formData.categoria) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (modoEdicao) {
      await editarVeiculo(formData);
    } else {
      await criarVeiculo(formData);
    }

    setFormData({ veiculo_id: null, placa: "", modelo: "", categoria: "" });
    setModoEdicao(false);
    buscarTodosOsVeiculos();
  }

  function carregarParaEdicao(veiculo) {
    setFormData({
      veiculo_id: veiculo.veiculo_id || "",
      placa: veiculo.placa || "",
      modelo: veiculo.modelo || "",
      categoria: veiculo.categoria || "" // ajustar se necessário
    });
    setModoEdicao(true);
  }

  const clear = () => {
    setFormData({
      veiculo_id: "",
      placa: "",
      modelo: "",
      categoria: "" // ajustar se necessário
    });
    setModoEdicao(false);
  };

  async function abrirModalRelacionamentos(veiculo) {
    await buscarInstrutores();
    setVeiculoSelecionado(veiculo);
    buscarRelacionamentos(veiculo.veiculo_id);
    setModalAberto(true);
  }

  return (
    <div className='flex flex-col gap-4'>

      {/* Formulário */}
      <div className='bg-white p-4 anim-hover card'>
        <h2 className='font-bold text-xl mb-2'>{modoEdicao ? "Editar Veículo" : "Cadastrar Veículo"}</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Input
            name="placa"
            placeholder="Placa"
            value={formData.placa}
            onChange={handleChange}
          />
          <Input
            name="modelo"
            placeholder="Modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
          <Input
            name="categoria"
            placeholder="Categoria (A/B/C...)"
            value={formData.categoria}
            onChange={handleChange}
          />
          <div className='flex w-full justify-between gap-2'>
            <Button type="submit" className={"flex-1"}>
              {modoEdicao ? "Salvar Alterações" : "Cadastrar"}
              <span className="material-icons">
                done
              </span>
            </Button>
            {modoEdicao &&
              <Button className={"flex-1"} type={"destructive"} onClick={() => clear()}>
                Cancelar Edição
                <span className="material-icons">
                  clear
                </span>
              </Button>}
          </div>
        </form>
      </div>

      {/* Busca + tabela */}
      <div className='p-6 bg-white anim-hover card'>
        <Input
          placeholder="Buscar veículo por modelo ou placa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className='flex-1 overflow-auto'>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrar.map((veiculo) => (
                <TableRow key={veiculo.veiculo_id || ""}>
                  <TableCell>{veiculo.modelo || ""}</TableCell>
                  <TableCell>{veiculo.placa || ""}</TableCell>
                  <TableCell>{veiculo.categoria || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant={veiculo.disponibilidade ? "green" : "destructive"}
                      className={'w-full'}
                      onClick={() => atualizarDisponibilidade(veiculo.veiculo_id, !veiculo.disponibilidade)}
                    >
                      {veiculo.disponibilidade ? "Ativo" : "Inativo"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="alert" onClick={() => carregarParaEdicao(veiculo)} className={'w-full'}>
                      Editar
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button className={'w-full'} variant="default" onClick={() => abrirModalRelacionamentos(veiculo)}>
                      Instrutor Responsável
                      <span className="material-icons">
                        key
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {modalAberto && veiculoSelecionado && (
        <Modal onClose={() => setModalAberto(false)}>
          <h2 className='text-2xl font-bold mb-4'>Relacionamentos com o veículo: {veiculoSelecionado.modelo}</h2>

          <div className='flex flex-col gap-4 items-center mb-4'>
            <Combobox
              options={instrutores.map(i => ({
                value: i.instrutor_id.toString(),
                label: i.nome_instrutor
              })) || []}
              value={instrutorSelecionado}
              onChange={(v) => setInstrutorSelecionado(v)}
            />
            <Button className={'w-full'} onClick={() => {
              if (instrutorSelecionado) {
                adicionarRelacionamento(instrutorSelecionado, veiculoSelecionado.veiculo_id);
              } else {
                toast.error("Selecione um instrutor.");
              }
            }}>
              Adicionar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instrutoresRelacionados.map((i) => (
                <TableRow key={i.instrutor_id}>
                  <TableCell>{i.instrutor_id}</TableCell>
                  <TableCell>{i.nome_instrutor}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => excluirRelacionamento(i.instrutor_id, veiculoSelecionado.veiculo_id)}>
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modal>
      )}

    </div>
  )
}
