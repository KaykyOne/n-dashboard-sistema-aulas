"use client"
import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datePicker';
import { Combobox } from '@/components/ui/combobox';
import useFinanceiro from '@/hooks/useFinanceiro';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Image from 'next/image';

import deleteImage from '@/imgs/imageDelete.svg';

const opcoesPesquisa = [
  {
    value: "Entrada",
    label: "Entrada"
  },
  {
    value: "Saida",
    label: "Saida"
  },
  {
    value: "Debito",
    label: "Debito",
  }
]

export default function FinanceiroPage() {

  //Hooks
  const { criarTransacao, error, res, loading, transacoes, transacoesUsuario, buscarTransacoes, buscarTransacaoPorUsuario, excluirTransacao } = useFinanceiro();

  //Transacoes
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [debitos, setDebitos] = useState([]);
  const [sumEntradas, setSumEntradas] = useState(0);
  const [sumDebitos, setSumDebitos] = useState(0);
  const [sumSaidas, setSumSaidas] = useState(0);

  // Filtros
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [filteredTransacoes, setFilteredTransacoes] = useState([...transacoes]);
  const [buscaPorNome, setBuscaPorNome] = useState("");
  const [buscaPorCPF, setBuscaPorCPF] = useState("");

  //Transacao por usuario
  const [cpfPesquisa, setCpfPesquisa] = useState("");

  // Criar Transação
  const [tipoTransacao, setTipoTransacao] = useState("Entrada");
  const [cpfCriar, setCpfCriar] = useState("");
  const [valorCriar, setValorCriar] = useState("");
  const [descricaoCriar, setDescicaoCriar] = useState("");

  //Excluir Transacao
  const [modalVisible, setModalVisible] = useState(false);
  const [moodalContent, setModalContent] = useState();

  useEffect(() => {
    const buscar = async () => {
      buscarTransacoes(1);
    }
    buscar();
  }, [])

  useEffect(() => {
    setEntradas(0);
    setSaidas(0);
    setDebitos(0);
    // console.log(transacoes);
    if (transacoes) {

      const entrada = transacoes.filter(transacao => transacao.tipo === "entrada");
      const saida = transacoes.filter(transacao => transacao.tipo === "saida");
      const debito = transacoes.filter(transacao => transacao.tipo === "debito");

      // Exibindo as transações filtradas para verificação
      // console.log('Entradas:', entrada);
      // console.log('Saídas:', saida);
      // console.log('Débitos:', debito);

      setEntradas(entrada);
      setSaidas(saida);
      setDebitos(debito);

      // Calcular os somatórios corretamente
      const sumE = entrada.reduce((acc, item) => acc + parseFloat(item.valor), 0);
      const sumS = saida.reduce((acc, item) => acc + parseFloat(item.valor), 0);
      let sumD = debito.reduce((acc, item) => acc + parseFloat(item.valor), 0);

      // console.log('Entradas o adm', sumE);
      // console.log('Saídas: o adm', sumS);
      // console.log('Débitos:o adm', sumD);
      // Formatar os valores
      setSumDebitos(formatarValor(parseFloat(sumD)));
      setSumEntradas(formatarValor(parseFloat(sumE)));
      setSumSaidas(formatarValor(parseFloat(sumS)));
    }
  }, [transacoes]);

  useEffect(() => {
    let filtered = [...entradas, ...saidas, ...debitos];

    if (startDate && endDate) {
      filtered = filtered.filter(transacao => {
        const transacaoDate = new Date(transacao.data);
        return transacaoDate >= new Date(startDate) && transacaoDate <= new Date(endDate);
      });
    }

    if (tipoFiltro) {
      filtered = filtered.filter(transacao => transacao.tipo === tipoFiltro.toLocaleLowerCase());
    }

    if (buscaPorNome) {
      filtered = filtered.filter(transacao => (transacao.nome + "" + transacao.sobrenome).toLocaleLowerCase().includes((buscaPorNome.trim()).toLocaleLowerCase()))
    }

    if (buscaPorCPF) {
      filtered = filtered.filter(transacao => (transacao.cpf).includes(buscaPorCPF))
    }

    setFilteredTransacoes(filtered);
  }, [startDate, endDate, tipoFiltro, entradas, saidas, debitos, buscaPorNome, buscaPorCPF]);

  useEffect(() => {
    if (error) {
      return;
    } else if (res) {
      setTipoTransacao("Entrada");
      setCpfCriar("");
      setValorCriar("");
      setDescicaoCriar("");
    }

  }, [loading])

  useEffect(() => {
    const pesquisar = async () => {
      await buscarTransacaoPorUsuario(cpfPesquisa)
    }

    pesquisar();

  }, [cpfPesquisa])

  const formatarValor = (valor) => {
    const valorPositivo = Math.abs(valor);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorPositivo);
  };

  const limparPesquisa = () => {
    setFilteredTransacoes([]);
    setStartDate('');
    setEndDate('');
    setTipoFiltro('');
  };

  const handleConfirm = async () => {
    const transacao = {
      cpf: cpfCriar,
      valor: valorCriar,
      descricao: descricaoCriar.toLocaleLowerCase(),
      tipo: tipoTransacao.toLocaleLowerCase(),
    }

    await criarTransacao(transacao);
  };

  const deleteTransacao = async (id) => {
    console.log("asdasd");
    if (!id) return;
    setModalContent(
      <div className='flex flex-col gap-3 text-center justify-center items-center'>
        <h1 className='text-2xl mb-2'>Deseja realmente excluir essa transação?</h1>
        <Image width={500} className='m-5' src={deleteImage} alt='Imagem Delete' />
        <div className='flex gap-2'>
          <Button variant={'green'} onClick={() => {
            setModalVisible(false);
            excluirTransacao(id, 1, cpfPesquisa);
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
    setModalVisible(true);

  }

  return (
    <div className='flex flex-col gap-4'>
      {loading && <Loading />}
      {modalVisible &&
        <Modal onClose={() => setModalVisible(false)}>
          {moodalContent}
        </Modal>}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 text-green-800'>
        <div className='bg-green-200 p-4 rounded-md'>
          <h1 className='text-2xl font-medium'>Entradas: </h1>
          <h1 className='text-4xl xl:text-6xl font-bold'>{sumEntradas}</h1>
        </div>
        <div className='bg-red-200 p-4 rounded-md text-red-800'>
          <h1 className='text-2xl font-medium'>Saídas:</h1>
          <h1 className='text-4xl xl:text-6xl font-bold'>{sumSaidas}</h1>
        </div>
        <div className='bg-orange-200 p-4 rounded-md text-orange-800'>
          <h1 className='text-2xl font-medium'>Débitos:</h1>
          <h1 className='text-4xl xl:text-6xl font-bold'>{sumDebitos}</h1>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Parte de Criar Transacao */}
        <div className='flex flex-col bg-white p-4 rounded-md gap-4'>
          <div className='flex flex-col xl:flex-row gap-4 justify-start'>
            <h1 className='text-3xl font-bold'>Gerar</h1>
            <Combobox
              onChange={setTipoTransacao}
              options={opcoesPesquisa}
              value={tipoTransacao}
              placeholder='Tipo'
              className={`max-w-[300px] text-black ${tipoTransacao === "Entrada" ? "bg-green-200" : tipoTransacao === "Saida" ? "bg-red-200" : tipoTransacao === "Debito" ? "bg-orange-200" : "bg-purple-200"}`}
            />
          </div>
          <form className='flex flex-col gap-2 mt-5'>
            <h1 className='text-2xl font-medium'>CPF:</h1>
            <Input
              placeholder="000.000.000-00"
              type="text"
              required
              value={cpfCriar}
              onChange={(e) => setCpfCriar(e.target.value)}
            />
            <h1 className='text-2xl font-medium'>Valor:</h1>
            <div className='flex gap-2'>
              <span className='font-bold text-2xl'>R$</span>
              <Input
                placeholder="0000,00"
                onKeyDown={(e) => {
                  if (e.key === '.' ) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => e.preventDefault()}
                type="number"
                maxLength={11}
                required
                value={valorCriar}
                onChange={(e) => setValorCriar(parseFloat(e.target.value) || 0)} />
            </div>
            <h1 className='text-2xl font-medium'>Oque é? (Descrição):</h1>
            <Input
              placeholder="Descreva sobre oque é isso (máximo 30 caracteres)"
              type="text"
              maxLength={30}
              required
              value={descricaoCriar}
              onChange={(e) => setDescicaoCriar(e.target.value)} />
          </form>
          <Button className={'w-full'} onClick={handleConfirm}>
            Confirmar
            <span className="material-icons">
              done
            </span>
          </Button>
        </div>
        {/* Parte de visualizar Transacao */}
        <div className='flex flex-col bg-white p-4 rounded-md gap-4'>
          <h1 className='text-3xl font-bold capitalize'>Ver transações Aluno</h1>
          <h3 className='font-medium text-2xl'>CPF:</h3>
          <div className='flex flex-col md:flex-row gap-2'>
            <Input
              placeholder="00000000000"
              type="text"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              required
              value={cpfPesquisa}
              onChange={(e) => setCpfPesquisa(e.target.value)}
            />
            <Button>Pesquisar
              <span className="material-icons">
                search
              </span>
            </Button>
          </div>

          <div className="flex-1 max-h-[150px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Excluir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesUsuario.map((transacao) =>
                  <TableRow key={transacao.transacao_id}>
                    <TableCell>{format(transacao.data, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{formatarValor(transacao.valor)}</TableCell>
                    <TableCell className={` capitalize ${transacao.tipo === "entrada" ? "bg-green-200 text-green-800 font-bold" :
                      transacao.tipo === "saida" ? "bg-red-200 text-red-800 font-bold" :
                        "bg-yellow-200 text-yellow-800 font-bold"}`
                    }>
                      {transacao.tipo}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={'destructive'}
                        className={'w-full'}
                        onClick={() => deleteTransacao(transacao.transacao_id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>

      <div className='bg-white p-4 rounded-md'>
        <div className='grid grid-cols-8 gap-4 p-4'>
          <Input placeholder={"Nome do Aluno"} className={'col-span-2'} value={buscaPorNome} onChange={(e) => setBuscaPorNome(e.target.value)} />
          <Input placeholder={"CPF do Aluno"} className={'col-span-2'} value={buscaPorCPF} onChange={(e) => setBuscaPorCPF(e.target.value)} />
          <DatePicker value={startDate} onChange={setStartDate} placeholder="Data Inicial" className={'col-span-1'} />
          <DatePicker value={endDate} onChange={setEndDate} placeholder="Data Final" className={'col-span-1'} />
          <Combobox
            onChange={setTipoFiltro}
            options={opcoesPesquisa}
            value={tipoFiltro}
            placeholder='Tipo'
            className={'col-span-1'}
          />
          <Button className={'col-span-1'} onClick={limparPesquisa}>
            <span className="material-icons">
              cleaning_services
            </span>
            Limpar
          </Button>
        </div>

        <div className='flex max-h-[500px] scroll-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Nome Aluno:</TableHead>
                <TableHead>CPF Aluno:</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransacoes.length > 0 && filteredTransacoes.map((transacao) =>
                <TableRow className={'capitalize'} key={transacao.transacao_id}>
                  <TableCell className={
                    transacao.tipo === "entrada" ? "bg-green-200 text-green-800 font-bold" :
                      transacao.tipo === "saida" ? "bg-red-200 text-red-800 font-bold" :
                        "bg-yellow-200 text-yellow-800 font-bold"
                  }>
                    {transacao.tipo}
                  </TableCell>
                  <TableCell>{transacao.nome + " " + transacao.sobrenome}</TableCell>
                  <TableCell>{(transacao.cpf).length > 11 && "inviável"}</TableCell>
                  <TableCell>{formatarValor(transacao.valor)}</TableCell>
                  <TableCell>{format(transacao.data, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Button
                      variant={'destructive'}
                      className={'w-full'}
                      onClick={() => deleteTransacao(transacao.transacao_id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
