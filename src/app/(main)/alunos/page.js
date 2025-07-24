"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import useAlunos from "@/hooks/useAlunos";
import useInstrutores from "@/hooks/useInstrutores";
import Loading from "@/components/Loading";
import { addYears, format, parse } from 'date-fns'
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import ModalAulas from "@/components/ModalAulas";
import Imprimir from "@/components/Imprimir";

const opcoesAtivoInativo = [
  {
    value: "Ativo",
    label: "Ativo"
  },
  {
    value: "Inativo",
    label: "Inativo"
  }
]

const opcoesDeTipo = [
  {
    value: "A",
    label: "A"
  },
  {
    value: "B",
    label: "B"
  },
  {
    value: "C",
    label: "C"
  },
  {
    value: "D",
    label: "D"
  },
  {
    value: "E",
    label: "E"
  },
]

const opcoesMes = [
  { value: "0", label: "Janeiro" },
  { value: "1", label: "Fevereiro" },
  { value: "2", label: "Março" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Maio" },
  { value: "5", label: "Junho" },
  { value: "6", label: "Julho" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Setembro" },
  { value: "9", label: "Outubro" },
  { value: "10", label: "Novembro" },
  { value: "11", label: "Dezembro" },
]

const cssSelecionado = 'p-2 border rounded-2xl cursor-pointer bg-black text-white hover:bg-white hover:text-black font-bold transition duration-300';
const cssSemSelecao = 'p-2 border rounded-2xl cursor-pointer hover:bg-black hover:text-white font-bold transition duration-300';

export default function AlunosPage() {

  //Buscar
  const {
    alunos: usuarios,
    loading,
    buscarAlunos,
    getInstrutoresResponsaveis,
    instrturesResponsaveis,
    inserirAluno,
    deletarUsuario,
    excluirAlunoInstrutor,
    inserirRelacao,
    alterAtividadeAluno,
    editarAluno } = useAlunos();

  const { buscarInstrutores, instrutores, loading: loadingInstrutor } = useInstrutores();
  //Editar
  const [editando, setEditando] = useState(false);
  const [idEdit, setIdEdit] = useState("")
  const [cpfInstrutorResponsavel, setCpfInstrutorResponsavel] = useState("");

  //Cadastrar
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState("");
  const [outraCidade, setOutraCidade] = useState(false);
  const [instrutorResponsa, setInstrutorResponsa] = useState();
  const [dataCadastro, setDataCadastro] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [open, setOpen] = useState(false);

  //Pesquisar
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);
  const [searchForName, setSearchForName] = useState("");
  const [searchForCPF, setSearchForCPF] = useState("");
  const [searchForCat, setSearchForCat] = useState("");
  const [searchForAtv, setSearchForAtv] = useState("");
  const [searchDataCadastro, setSearchDataCadastro] = useState("");

  //Navegação
  const [numPagina, setNumPagina] = useState(0);

  //Transacao
  const [valorCriar, setValorCriar] = useState("");
  const [descricaoCriar, setDescicaoCriar] = useState("");

  //Modal
  const [modalContent, setModalContent] = useState("");
  const [idAlunoVerAulas, setIdAlunoVerAulas] = useState(0);

  const isNumeric = (str) => /^[0-9]+$/.test(str);

  const filtrarUsuarios = () => {

    const test = searchForAtv === "Inativo" ? false : true;
    const users = usuarios.filter((user) => {
      const matchName = searchForName === "" || (user.nome || "").toLowerCase().includes(searchForName.toLowerCase())
      const matchCpf = searchForCPF === "" || user.cpf.includes(searchForCPF);
      const matchCat = searchForCat === "" || (user.categoria_pretendida || "").toLowerCase().includes(searchForCat.toLowerCase());
      const matchForAtv = searchForAtv === "" || user.atividade == test;
      const userDate = new Date(user.data_cadastro).getMonth();
      const tipoMach = tipoUsuario === "" || user.tipo_usuario === tipoUsuario;
      const matchData = searchDataCadastro === "" || Number(searchDataCadastro) === userDate;
      return matchName && matchCpf && matchCat && matchForAtv && matchData && tipoMach;
    })
    setUsuariosFiltrados(users);
  };
  const handleCheckboxChange = (event, tipo) => {
    setCategoria((prev) => {
      if (event.target.checked) {
        return [...prev, tipo]; // adiciona
      } else {
        return prev.filter((item) => item !== tipo); // remove
      }
    });
  };
  const cancelEdit = () => {
    setNome("");
    setSobrenome("");
    setCpf("");
    setCpfInstrutorResponsavel("");
    setInstrutorResponsa("")
    setTelefone("");
    setDataCadastro("");
    setCategoria("");
    setOutraCidade(false);
    setEditando(false);
    setIdEdit("");
  };
  const startEdit = (user) => {
    setEditando(true);
    setNome(user.nome);
    setSobrenome(user.sobrenome);
    setDataCadastro(format(user.data_cadastro, 'yyyy-MM-dd'));
    setCpf(user.cpf);
    setCpfInstrutorResponsavel(user.cpf);
    setTelefone(user.telefone);
    let userCategoria = user.categoria_pretendida?.toUpperCase() || "";
    let categorias = userCategoria.split("");
    setCategoria(categorias);
    setOutraCidade(user.outra_cidade);
    if(open) return;
    setOpen(!open);
  };
  const clearAll = () => {
    setEditando(false);
    setCpfInstrutorResponsavel("");

    setNome("");
    setSobrenome("");
    setCpf("");
    setTelefone("");
    setCategoria("");
    setOutraCidade(false);
    setInstrutorResponsa(undefined);
    setDataCadastro("");

    setUsuariosFiltrados(usuarios);
    setSearchForName("");
    setSearchForCPF("");
    setSearchForCat("");
    setSearchForAtv("");
    setSearchDataCadastro("");
  };

  useEffect(() => {
    buscarAlunos();
    buscarInstrutores();
  }, []);
  useEffect(() => {
    getInstrutoresResponsaveis(cpfInstrutorResponsavel);
  }, [cpfInstrutorResponsavel])
  useEffect(() => {
    // Sempre que "usuarios" mudar, atualiza os filtrados
    setUsuariosFiltrados(usuarios);
    setSearchForAtv("Ativo");
    filtrarUsuarios();
  }, [usuarios]);
  useEffect(() => {
    setNumPagina(0);
    if (searchForName == "" && searchForCPF == "" && searchForCat == "" && searchDataCadastro == "") {
      let test = searchForAtv == "Inativo" ? false : true;
      let users = usuarios.filter(user => user.atividade == test && user.tipo_usuario === tipoUsuario);
      setUsuariosFiltrados(users);
      return;
    }
    filtrarUsuarios();
  }, [searchForName, searchForCPF, searchForCat, searchForAtv, searchDataCadastro])

  const testCampos = () => {
    if (typeof nome != "string") {
      toast.error("erro, nome está errado!");
      return false;
    }
    if (typeof sobrenome != "string") {
      toast.error("erro, sobrenome está errado!");
      return false;
    }
    if (!isNumeric(cpf) && cpf.length === 11) {
      toast.error("erro, cpf está errado!");
      return false;
    }
    if (!isNumeric(telefone) && !(cpf.length > 9 && cpf.length < 12)) {
      toast.error("erro, telefone está errado!");
      return false;
    }
    if (categoria.length == 0) {
      toast.error("erro, categoria está errado!");
      return false;
    }
    if (typeof outraCidade != "boolean") {
      toast.error("erro, outraCidade está errado!");
      return false;
    }
    if (valorCriar < 0) {
      toast.error("erro, o valor tem q ser positivo está errado!");
      return false;
    }
    if (typeof descricaoCriar != "string") {
      toast.error("erro, outraCidade está errado!");
      return false;
    }

    return true;
  };
  const handleCadastrar = async () => {
    const test = testCampos();
    if (test && !editando) {
      const categoriaFormat = categoria.join('');
      const aluno = ({
        nome: nome,
        sobrenome: sobrenome,
        cpf: cpf,
        tipo: tipoUsuario,
        telefone: telefone,
        categoria: categoriaFormat,
        data_cadastro: dataCadastro,
        outra_cidade: outraCidade,
      });

      const transacao = {
        cpf: cpf,
        valor: valorCriar,
        descricao: descricaoCriar.toLocaleLowerCase(),
        tipo: 'debito',
      }

      await inserirAluno(aluno, transacao);

      setNome("");
      setSobrenome("");
      setCpf("");
      setTelefone("");
      setDataCadastro("");
      setCategoria("");
      setOutraCidade(false);
      setValorCriar("");
      setDescicaoCriar("");
    }
  };
  const handleEdit = async () => {

    const test = testCampos();
    if (test && editando) {
      const categoriaFormat = categoria.join('');

      const aluno = ({
        usuario_id: idEdit,
        nome: nome,
        sobrenome: sobrenome,
        cpf: cpf,
        tipo: 'aluno',
        telefone: telefone,
        categoria: categoriaFormat,
        data_cadastro: dataCadastro,
        outra_cidade: outraCidade,
      });

      await editarAluno(aluno);

      setNome("");
      setSobrenome("");
      setCpf("");
      setTelefone("");
      setCategoria("");
      setDataCadastro("");
      setOutraCidade(false);
      setEditando(false);
      setCpfInstrutorResponsavel("")
      setInstrutorResponsa([])
      setIdEdit("");

      await buscarAlunos();
    }
  };
  const handleAlterState = async (user) => {
    const res = await alterAtividadeAluno(user.usuario_id);
    if (res) {
      console.log(res);
      user.atividade = !user.atividade;
      filtrarUsuarios();
    }
  };
  const handleDeleteRelation = async (instrutor) => {
    await excluirAlunoInstrutor(cpfInstrutorResponsavel, instrutor.instrutor_id);
  };
  const handleCreateRelation = async () => {
    if (!cpfInstrutorResponsavel || cpfInstrutorResponsavel === "") return;
    await inserirRelacao(cpfInstrutorResponsavel, instrutorResponsa);
  };
  const instrutoresOptions = instrutores.filter(i => i.atividade_instrutor == true).map((i) => ({
    value: i.instrutor_id.toString(),
    label: i.nome_instrutor,
  }));

  const alterarNavegacao = (num) => {
    const val = numPagina + num;
    if (val >= 0 && (val - 10) <= usuariosFiltrados.length) {
      setNumPagina(val);
    }
  };

  useEffect(() => {
    let filterUsers = usuarios.filter(item => item.tipo_usuario === tipoUsuario);
    if (tipoUsuario == 'aluno') {
      filterUsers = usuarios.filter(item => !!item.atividade === true);
    }
    setUsuariosFiltrados(filterUsers);
  }, [tipoUsuario])

  const deletePreCadastroConfirm = async (id) => {
    setModalContent(
      <div>
        <h1>Tem certeza que deseja excluir esse precadastro?</h1>

        <Button onClick={async () => { deletarUsuario(id); setModalContent(""); }}>Confirmar</Button>
        <Button onClick={() => setModalContent("")}>Cancelar</Button>
      </div>
    )
  };
  const CadastrarPreCadastroConfirm = async (user) => {
    setModalContent(
      <div>
        <h1>Tem certeza que deseja Cadastrar esse precadastro?</h1>
        <Button onClick={async () => cadastrarPreCadastro(user)}>Confirmar</Button>
        <Button onClick={() => setModalContent("")}>Cancelar</Button>
      </div>
    )
  };
  const cadastrarPreCadastro = async (user) => {
    user.tipo_usuario = "aluno";
    await editarAluno(user);
    setModalContent("");
  };

  return (
    <div className="relative">
      {loading || loadingInstrutor && <Loading />}
      <div className="flex flex-col gap-4">

        <details className="group anim-hover" open={open} onToggle={(e) => setOpen(e.target.open)}>
          <summary className="flex gap-2 cursor-pointer font-semibold border text-gray-600 border-gray-30 bg-white rounded p-4"
            onClick={(e) => {
              e.preventDefault(); // <== isso impede o HTML de abrir sozinho
              setOpen(!open);
            }}>
            Adicione ou atualize informações do usuáriom, só clicar aqui!
            <span className="material-icons">
              ads_click
            </span>
          </summary>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Form de cadastro */}
            <div className="flex flex-col col-span-2 p-6 bg-white rounded-sm gap-2">
              <div className="flex gap-2">
                <button onClick={() => setTipoUsuario('aluno')} className={tipoUsuario == "aluno" ? cssSelecionado : cssSemSelecao}>Aluno</button>
                <button onClick={() => setTipoUsuario('precadastro')} className={tipoUsuario == "precadastro" ? cssSelecionado : cssSemSelecao}>Precadastro</button>
              </div>
              <h1 className="font-bold text-3xl capitalize">{editando ? 'Editando' : 'Cadastrar'} {tipoUsuario}:</h1>
              <p className="text-xl font-semibold">Nome:</p>
              <Input type="text" placeholder="Nome" required maxLength={20} value={nome} onChange={(e) => setNome(e.target.value)} />
              <p className="text-xl font-semibold">Sobrenome:</p>
              <Input type="text" placeholder="Sobrenome" required maxLength={20} value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
              <p className="text-xl font-semibold">CPF:</p>
              <Input type="text" placeholder="CPF" required minLength={11} maxLength={11} value={cpf} onChange={(e) => setCpf(e.target.value)} />
              <p className="text-xl font-semibold">Categoria:</p>
              <div className="flex gap-2">
                {opcoesDeTipo.map((tipo) => {
                  const isChecked = categoria.includes(tipo.value);
                  return (
                    <div className="flex gap-2" key={tipo.value}>
                      <input
                        type="checkbox"
                        id={`tipo${tipo.value}`}
                        checked={isChecked}  // Verifica se a categoria está marcada
                        onChange={(event) => handleCheckboxChange(event, tipo.value)}  // Atualiza o estado com base no evento
                      />
                      <label className="font-bold" htmlFor={`tipo${tipo.value}`}>
                        {tipo.value}
                      </label>
                    </div>
                  );
                })}
              </div>
              <p className="text-xl font-semibold">Telefone:</p>
              <Input type="text" placeholder="Telefone" required minLength={10} maxLength={11} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              <p className="text-xl font-semibold">Data Cadastro:</p>
              <Input type="date" placeholder="dia/mes/ano" required minLength={10} maxLength={10} value={dataCadastro} onChange={(e) => setDataCadastro(e.target.value)} />
              <div className="flex gap-2">
                <input type="checkbox" id="outraCidade" checked={outraCidade} onChange={(e) => setOutraCidade(e.target.checked)} />
                <label className="font-bold" htmlFor="outraCidade">Privilégio(isso dará privilégio para o aluno)</label>
              </div>
              {!editando &&
                <div className="flex flex-col border-gray-300 border-2 p-3 rounded-2xl gap-2">
                  <h1 className="text-2xl font-bold">Finaceiro Inicial</h1>
                  <p className="text-xl font-semibold">Valor:</p>
                  <div className='flex gap-2'>
                    <span className='font-bold text-2xl'>R$</span>
                    <Input
                      placeholder="Valor"
                      type="number"
                      min="0"
                      max="999999"  // Máximo de 11 dígitos
                      step="0.01"         // Para permitir valores decimais, se necessário
                      required
                      value={valorCriar || ""}
                      onChange={(e) => setValorCriar(e.target.valueAsNumber || 0)} />
                  </div>
                  <p className="text-xl font-semibold">Descrição:</p>
                  <Input
                    placeholder="Descreva sobre oque é isso (máximo 30 caracteres)"
                    type="text"
                    maxLength={30}
                    required
                    value={descricaoCriar}
                    onChange={(e) => setDescicaoCriar(e.target.value)} />
                </div>
              }
              <div className={`gap-2 ${editando ? 'grid grid-cols-2' : 'flex'}`}>
                <Button
                  type="submit"
                  className={editando ? "" : "w-full"}
                  onClick={editando ? () => handleEdit() : () => handleCadastrar()}>
                  {editando ? "Finalizar Edição" : "Cadastrar"}
                  <span className="material-icons">
                    add
                  </span>
                </Button>
                {editando &&
                  <Button variant={"destructive"} onClick={cancelEdit}>
                    Cancelar Edição
                    <span className="material-icons">
                      close
                    </span>
                  </Button>}
              </div>
            </div>

            {/* Parte Instrutor responsavel */}
            <div className="flex flex-col col-span-1 p-6 bg-white rounded-sm gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-3xl">Instrutores Respónsaveis pelo Aluno:</h1>
                <Input
                  placeholder={"CPF"}
                  className={"mt-3"}
                  value={cpfInstrutorResponsavel}
                  onChange={(e) => setCpfInstrutorResponsavel(e.target.value)} />
                <Combobox
                  options={instrutoresOptions || []}
                  placeholder='Escolha o Instrutor'
                  onChange={setInstrutorResponsa}
                  value={instrutorResponsa} />
                <Button className="mt-4" onClick={() => handleCreateRelation()}>
                  Adicionar Responsável
                  <span className="material-icons">
                    add
                  </span>
                </Button>
              </div>
              <div className='flex flex-col flex-1 overflow-x-auto border-gray-200 border-solid border-2 w-full rounded-sm'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instrutor ID</TableHead>
                      <TableHead>Nome Instrutor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instrturesResponsaveis.map((instrutor) => (
                      <TableRow key={instrutor.instrutor_id}>
                        <TableCell>{instrutor.instrutor_id}</TableCell>
                        <TableCell>{instrutor.nome_instrutor}</TableCell>
                        <TableCell><Button variant={'destructive'} onClick={() => handleDeleteRelation(instrutor)}>Excluir</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </details>

        {/* Listar Alunos */}
        <div className="p-6 row-span-2 col-span-2 bg-white rounded-sm anim-hover">
          <h1 className="font-bold text-3xl">Pesquisar Alunos:</h1>
          {/* Barra de pesquisa */}
          <div className="flex gap-4">
            <div className="flex flex-col mb-4 w-full">
              <h3 className="font-bold">Nome:</h3>
              <Input
                placeholder="Buscar usuário por Nome..."
                value={searchForName}
                onChange={(e) => setSearchForName(e.target.value)}
                className="mb-4 w-full"
              />
            </div>
            <div className="flex flex-col mb-4 w-full">
              <h3 className="font-bold">CPF:</h3>
              <Input
                placeholder="Buscar usuário por CPF..."
                value={searchForCPF}
                onChange={(e) => setSearchForCPF(e.target.value)}
                className="mb-4 w-full"
              />
            </div>
            <div className="flex flex-col mb-4 w-full">
              <h3 className="font-bold">Mês Cadastro:</h3>
              <Combobox
                placeholder="Mês..."
                options={opcoesMes}
                onChange={setSearchDataCadastro}
                value={searchDataCadastro} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold">Categoria:</h3>
              <Combobox
                placeholder="Categoria..."
                options={opcoesDeTipo}
                onChange={setSearchForCat}
                value={searchForCat} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold">Status:</h3>
              <Combobox
                placeholder="Status..."
                options={opcoesAtivoInativo}
                onChange={setSearchForAtv}
                value={searchForAtv} />
            </div>
            <div className="h-full justify-center items-end">
              <Button onClick={() => clearAll()}>
                Limpar
                <span className="material-icons">
                  cleaning_services
                </span>
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col">
              {/* Cabeçalho */}
              <div className={"grid grid-cols-10 font-bold p-3 border-b bg-gray-100"}>
                <p>Nome</p>
                <p>CPF</p>
                <p>Telefone</p>
                <p>Categoria</p>
                <p>Data Cadastro</p>
                <p>Data Limite</p>
                <p>Preferência</p>
                {tipoUsuario === 'aluno' ?
                  <>
                    <p>Status</p>
                    <p>Editar</p>
                    <p>Aulas</p>
                  </>
                  :
                  <>
                    <p>Cadastrar</p>
                    <p>Editar</p>
                    <p>Excluir</p>
                  </>}

              </div>

              {/* Lista */}
              <div className="flex flex-col divide-y">
                {usuariosFiltrados && usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados
                    .filter((_, index) => index >= numPagina && index < numPagina + 10)
                    .map((user) => (
                      <div
                        key={user.usuario_id}
                        className={"grid grid-cols-10 items-center text-sm p-3"}
                      >
                        <p className="capitalize">{user.nome || ''} {user.sobrenome || ''}</p>
                        <p>{user.cpf?.length > 11 ? "inviável" : user.cpf || ''}</p>
                        <p>{user.telefone || ''}</p>
                        <p>{user.categoria_pretendida?.toUpperCase() || ""}</p>
                        <p>{user.data_cadastro ? format(user.data_cadastro, 'dd/MM/yyyy') : ''}</p>
                        <p>{user.data_cadastro ? format(addYears(user.data_cadastro, 1), 'dd/MM/yyyy') : ''}</p>
                        <p>{user.outra_cidade ? "Sim" : "Não"}</p>

                        <div className="p-1">
                          {tipoUsuario === 'aluno' ? (
                            <Button
                              className="w-full"
                              variant={user.atividade ? "green" : "destructive"}
                              onClick={() => handleAlterState(user)}
                            >
                              {user.atividade ? "Ativo" : "Inativo"}
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              variant="green"
                              onClick={() => CadastrarPreCadastroConfirm(user)}
                            >
                              Cadastrar
                              <span className="material-icons">add</span>
                            </Button>
                          )}
                        </div>

                        <div className="w-full p-1">
                          <Button
                            className="w-full"
                            variant="alert"
                            onClick={() => {
                              startEdit(user);
                              setIdEdit(user.usuario_id);
                            }}
                          >
                            Editar
                            <span className="material-icons">edit</span>
                          </Button>
                        </div>

                        {tipoUsuario === 'precadastro' ? (
                          <div className="w-full p-1">
                            <Button
                              className="w-full"
                              variant="destructive"
                              onClick={() => {
                                deletePreCadastroConfirm(user.usuario_id);
                              }}
                            >
                              Excluir
                              <span className="material-icons">delete</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full p-1">
                            <Button
                              className="w-full"
                              onClick={() => setIdAlunoVerAulas(user.usuario_id)}
                            >
                              Aulas
                              <span className="material-icons">
                                book
                              </span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-center text-sm text-gray-500 p-4">Carregando usuários...</p>
                )}
              </div>
              <Imprimir>
                <div className="flex flex-col" style={{ display: 'none' }} id="print-area">
                  <div className="grid grid-cols-10 font-semibold text-sm border-b pb-2 mb-2">
                    <p>Nome</p>
                    <p>CPF</p>
                    <p>Telefone</p>
                    <p>Categoria</p>
                    <p>Data Cadastro</p>
                    <p>Data Limite</p>
                    <p>Preferência</p>
                    <p>Status</p>
                    <p colSpan={2}>---</p>
                  </div>

                  {usuariosFiltrados && usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((user) => (
                      <div
                        key={user.usuario_id}
                        className="grid grid-cols-10 items-center text-sm p-2 border-b"
                      >
                        <p className="capitalize">{user.nome || ''} {user.sobrenome || ''}</p>
                        <p>{user.cpf?.length > 11 ? "inviável" : user.cpf || ''}</p>
                        <p>{user.telefone || ''}</p>
                        <p>{user.categoria_pretendida?.toUpperCase() || ""}</p>
                        <p>{user.data_cadastro ? format(user.data_cadastro, 'dd/MM/yyyy') : ''}</p>
                        <p>{user.data_cadastro ? format(addYears(user.data_cadastro, 1), 'dd/MM/yyyy') : ''}</p>
                        <p>{user.outra_cidade ? "Sim" : "Não"}</p>
                        <p>{user.atividade ? "Ativo" : "Inativo"}</p>
                        <p colSpan={2}> </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm p-4">
                      Nenhum usuário encontrado...
                    </p>
                  )}
                </div>
              </Imprimir>
            </div>
          </div>
        </div>

        {/*Navegação de Paginas*/}
        <div className="flex justify-center items-center text-black">
          <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(-10)}>
            arrow_left
          </span>
          <div className="flex flex-col gap-1 justify-center items-center">
            {`${numPagina / 10} - ${(usuariosFiltrados.length % 10)}`}
          </div>
          <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(10)}>
            arrow_right
          </span>
        </div>

      </div>


      {/*#region Modal*/}
      {
        modalContent &&
        <Modal onClose={() => setModalContent("")}>
          {modalContent}
        </Modal>
      }
      {
        idAlunoVerAulas != 0 &&
        <ModalAulas onClose={() => setIdAlunoVerAulas(0)} idAluno={idAlunoVerAulas}>

        </ModalAulas>
      }
      {/*#endregion*/}

    </div >
  );
}
