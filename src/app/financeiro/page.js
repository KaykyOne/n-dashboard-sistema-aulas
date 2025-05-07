"use client"
import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/datePicker';
import { Combobox } from '@/components/ui/combobox';

const transacoes = [
  {
    transacao_id: 1,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'entrada',
    valor: 150.00,
    data: '2025-05-01',
    descricao: 'Pagamento da matrícula',
  },
  {
    transacao_id: 2,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'saida',
    valor: 50.00,
    data: '2025-05-02',
    descricao: 'Compra de material',
  },
  {
    transacao_id: 3,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'entrada',
    valor: 100.00,
    data: '2025-05-03',
    descricao: 'Aula avulsa',
  },
  {
    transacao_id: 4,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'saida',
    valor: 25.00,
    data: '2025-05-04',
    descricao: 'Taxa de manutenção',
  },
  {
    transacao_id: 5,
    usuario: { usuario_id: 3, nome: "carlos", sobrenome: "carlos", cpf: "231231232313" },
    tipo: 'debito',
    valor: 280.00,
    data: '2025-05-04',
    descricao: 'Taxa de manutenção',
  },
];

const transacoesAluno = [
  {
    transacao_id: 1,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'entrada',
    valor: 150.00,
    data: '2025-05-01',
    descricao: 'Pagamento da matrícula',
  },
  {
    transacao_id: 2,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'saida',
    valor: 50.00,
    data: '2025-05-02',
    descricao: 'Compra de material',
  },
  {
    transacao_id: 3,
    usuario: { usuario_id: 3, nome: "roberto", sobrenome: "carlos", cpf: "12345678912" },
    tipo: 'entrada',
    valor: 100.00,
    data: '2025-05-03',
    descricao: 'Aula avulsa',
  },
];

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


  // Criar Transação
  const [tipoTransacao, setTipoTransacao] = useState("Entrada");

  useEffect(() => {
    const entrada = transacoes.filter(transacao => transacao.tipo === "entrada");
    const saida = transacoes.filter(transacao => transacao.tipo === "saida");
    const debito = transacoes.filter(transacao => transacao.tipo === "debito");
    setEntradas(entrada);
    setSaidas(saida);
    setDebitos(debito);

    const sumE = Object.values(entrada).reduce((acc, item) => acc + item.valor, 0);
    const sumS = Object.values(saida).reduce((acc, item) => acc + item.valor, 0);
    let sumD = Object.values(debito).reduce((acc, item) => acc + item.valor, 0);
    sumD = sumE - sumD;
    if (sumD > 0) sumD = 0;
    setSumDebitos(formatarValor(sumD));
    setSumEntradas(formatarValor(sumE));
    setSumSaidas(formatarValor(sumS));
  }, []);

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

    if(buscaPorNome){
      filtered = filtered.filter(transacao => (transacao.usuario.nome + "" + transacao.usuario.sobrenome).toLocaleLowerCase().includes((buscaPorNome.trim()).toLocaleLowerCase()))
    }

    if(buscaPorCPF){
      filtered = filtered.filter(transacao => (transacao.usuario.cpf).includes(buscaPorCPF))
    }

    setFilteredTransacoes(filtered);
  }, [startDate, endDate, tipoFiltro, entradas, saidas, debitos, buscaPorNome, buscaPorCPF]);

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
  }

  return (
    <div className='flex flex-col gap-4'>
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
              placeholder="00000000000"
              type="text"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              required
            />
            <h1 className='text-2xl font-medium'>Valor:</h1>
            <div className='flex gap-2'>
              <span className='font-bold text-2xl'>R$</span>
              <Input
                placeholder="0000,00"
                type="number"
                inputMode="numeric"
                pattern="\d{11}"
                maxLength={11}
                required />
            </div>
          </form>
          <Button className={'w-full'}>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesAluno.map((transacao) =>
                  <TableRow key={transacao.transacao_id}>
                    <TableCell>{format(transacao.data, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{formatarValor(transacao.valor)}</TableCell>
                    <TableCell className={` capitalize ${transacao.tipo === "entrada" ? "bg-green-200 text-green-800 font-bold" :
                      transacao.tipo === "saida" ? "bg-red-200 text-red-800 font-bold" :
                        "bg-yellow-200 text-yellow-800 font-bold"}`
                    }>
                      {transacao.tipo}
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
          <Input placeholder={"CPF do Aluno"} className={'col-span-2'} value={buscaPorCPF} onChange={(e) => setBuscaPorCPF(e.target.value)}/>
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
                <TableCell>{transacao.usuario.nome + " " + transacao.usuario.sobrenome}</TableCell>
                <TableCell>{transacao.usuario.cpf}</TableCell>
                <TableCell>{formatarValor(transacao.valor)}</TableCell>
                <TableCell>{format(transacao.data, 'dd/MM/yyyy')}</TableCell>
                <TableCell><Button variant={'destructive'} className={'w-full'}>Excluir</Button></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
