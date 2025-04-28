"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Combobox } from "@/components/ui/combobox";

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

const usuarios = [
  {
    usuario_id: 1,
    nome: "Lucas",
    sobrenome: "Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 91234-5678",
    categoria_pretendida: "A",
    num_aulas: 10,
    data_cadastro: "2024-04-10",
    outra_cidade: false,
    atividade: true,
    senha: "senha123",
    autoescola_id: 1,
    updated_at: "2025-04-27T12:00:00"
  },
  {
    usuario_id: 2,
    nome: "Mariana",
    sobrenome: "Souza",
    cpf: "987.654.321-00",
    telefone: "(21) 99876-5432",
    categoria_pretendida: "B",
    num_aulas: 5,
    data_cadastro: "2024-05-15",
    outra_cidade: true,
    atividade: true,
    senha: "senha456",
    autoescola_id: 1,
    updated_at: "2025-04-27T12:05:00"
  },
  {
    usuario_id: 3,
    nome: "Pedro",
    sobrenome: "Almeida",
    cpf: "456.123.789-00",
    telefone: "(31) 98765-4321",
    categoria_pretendida: "AB",
    num_aulas: 12,
    data_cadastro: "2024-03-20",
    outra_cidade: false,
    atividade: false,
    senha: "senha789",
    autoescola_id: 2,
    updated_at: "2025-04-27T12:10:00"
  },
  {
    usuario_id: 4,
    nome: "Ana",
    sobrenome: "Pereira",
    cpf: "321.654.987-00",
    telefone: "(41) 97654-3210",
    categoria_pretendida: "B",
    num_aulas: 8,
    data_cadastro: "2024-06-01",
    outra_cidade: true,
    atividade: true,
    senha: "senha321",
    autoescola_id: 2,
    updated_at: "2025-04-27T12:15:00"
  },
  {
    usuario_id: 5,
    nome: "Rafael",
    sobrenome: "Costa",
    cpf: "789.123.456-00",
    telefone: "(51) 96543-2109",
    categoria_pretendida: "A",
    num_aulas: 6,
    data_cadastro: "2024-02-25",
    outra_cidade: false,
    atividade: true,
    senha: "senha654",
    autoescola_id: 1,
    updated_at: "2025-04-27T12:20:00"
  }
]

const instrutores = [
  { instrutor_id: 1, nome_instrutor: "João Silva", tipo_instrutor: "A", atividade_instrutor: true },
  { instrutor_id: 2, nome_instrutor: "Maria Souza", tipo_instrutor: "B", atividade_instrutor: false },
  { instrutor_id: 3, nome_instrutor: "Carlos Lima", tipo_instrutor: "AB", atividade_instrutor: true },
  { instrutor_id: 4, nome_instrutor: "Fernanda Alves", tipo_instrutor: "A", atividade_instrutor: true },
  { instrutor_id: 5, nome_instrutor: "Pedro Henrique", tipo_instrutor: "B", atividade_instrutor: false },
];

export default function AlunosPage() {

  //Editar
  const [editando, setEditando] = useState(false);
  const [cpfInstrutorResponsavel, setCpfInstrutorResponsavel] = useState("");

  //Cadastrar
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState("");
  const [outraCidade, setOutraCidade] = useState(false);

  //Pesquisar
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);
  const [searchForName, setSearchForName] = useState("");
  const [searchForCPF, setSearchForCPF] = useState("");
  const [searchForCat, setSearchForCat] = useState("");
  const [searchForAtv, setSearchForAtv] = useState("Ativo");

  const isNumeric = (str) => /^[0-9]+$/.test(str);

  const filtrarUsuarios = () => {
    let users;
    if (searchForName == "" && searchForCPF == "" && searchForCat == "" && searchForAtv == "") {
      setUsuariosFiltrados(usuarios);
      return;
    }
    if (searchForName != "") {
      users = usuarios.filter((user) =>
        user.nome.toLowerCase().includes(searchForName.toLowerCase())
      );
    }
    if (searchForCPF != "") {
      users = usuarios.filter((user) =>
        user.cpf.toLowerCase().includes(searchForCPF.toLowerCase())
      );
    }
    if (searchForCat != "") {
      users = usuarios.filter((user) =>
        user.categoria_pretendida.toLowerCase().includes(searchForCat.toLowerCase())
      );
    }
    if (searchForAtv != "") {
      let test = searchForAtv == "Inativo" ? false : true;
      users = usuarios.filter(user => user.atividade == test)
    }

    setUsuariosFiltrados(users);
  }

  const handleCheckboxChange = (event, tipo) => {
    if (event.target.checked) {
      // Se o checkbox foi marcado, adiciona a categoria
      setCategoria((prev) => [...prev, tipo]);
    } else {
      // Se o checkbox foi desmarcado, remove a categoria
      setCategoria((prev) => prev.filter((item) => item !== tipo));
    }
  };

  const cancelEdit = () => {
    setNome("");
    setSobrenome("");
    setCpf("");
    setCpfInstrutorResponsavel("");
    setTelefone("");
    setCategoria("");
    setOutraCidade(false);
    setEditando(false);
  }

  const startEdit = (user) => {
    setEditando(true);
    setNome(user.nome);
    setSobrenome(user.sobrenome);
    setCpf(user.cpf);
    setCpfInstrutorResponsavel(user.cpf);
    setTelefone(user.telefone);
    setCategoria(user.categoria_pretendida);
    setOutraCidade(user.outra_cidade);
  }

  useEffect(() => {
    filtrarUsuarios();
  }, [searchForName, searchForCPF, searchForCat, searchForAtv])

  const handleSubmit = (e) => {
    e.preventDefault();


    if (typeof nome != "string") {
      alert("erro, nome está errado!");
      return;
    }
    if (typeof sobrenome != "string") {
      alert("erro, sobrenome está errado!");
      return;
    }
    if (!isNumeric(cpf)) {
      alert("erro, cpf está errado!");
      return;
    }
    if (!isNumeric(telefone)) {
      alert("erro, telefone está errado!");
      return;
    }
    alert(categoria);
    if (typeof categoria != "string") {
      alert("erro, categoria está errado!");
      return;
    }
    if (typeof outraCidade != "boolean") {
      alert("erro, outraCidade está errado!");
      return;
    }

    alert(categoria);

    console.log("Formulário enviado");
    console.log({
      nome,
      sobrenome,
      cpf,
      telefone,
      categoria,
      outraCidade,
    });

    // Resetar o formulário (se necessário)
    setNome("");
    setSobrenome("");
    setCpf("");
    setTelefone("");
    setCategoria("");
    setOutraCidade(false);
  };

  const handleAlterState = (user) => {
    user.atividade = !user.atividade;
    filtrarUsuarios();
  }

  const instrutoresOptions = instrutores.map((i) => ({
    value: i.instrutor_id.toString(),
    label: i.nome_instrutor,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Form de cadastro */}
        <div className="flex flex-col col-span-2 p-6 bg-white rounded-sm">
          <h1 className="font-bold text-3xl">{editando ? 'Editando' : 'Cadastrar'} Aluno:</h1>
          <form className="flex flex-col gap-2 pt -2" onSubmit={handleSubmit}>
            <Input type="text" placeholder="Nome" required maxLength="20" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input type="text" placeholder="Sobrenome" required maxLength="20" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
            <Input type="text" placeholder="CPF" required minlength="11" maxlength="11" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <h3 className="font-bold text-2xl">Categoria:</h3>
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
            <Input type="text" placeholder="Telefone" required minlength="10" maxlength="11" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            <div className="flex gap-2">
              <input type="checkbox" id="outraCidade" checked={outraCidade} onChange={(e) => setOutraCidade(e.target.checked)} />
              <label className="font-bold" htmlFor="outraCidade">Outra Cidade(isso dará privilégio para o aluno)</label>
            </div>
            <div className={`gap-2 ${editando ? 'grid grid-cols-2' : 'flex'}`}>
              <Button type="submit" className={editando ? "" : "w-full"}>
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

          </form>
        </div>

        {/* Parte Instrutor responsavel */}
        <div className="flex flex-col col-span-1 p-6 bg-white rounded-sm gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl">Instrutores Respónsaveis pelo Aluno:</h1>
            <Input placeholder={"CPF"} className={"mt-3"} value={cpfInstrutorResponsavel} onChange={(e) => setCpfInstrutorResponsavel(e.target.value)} />
            <Combobox options={instrutoresOptions} placeholder='Escolha o Instrutor' />
            <Button className="mt-4">
              Adicionar Responsável
              <span className="material-icons">
                add
              </span>
            </Button>
          </div>
          <div className='flex flex-col flex-1 overflow-x-auto border-gray-200 border-solid border-2 w-full max-h-[200px] rounded-sm'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrutor ID</TableHead>
                  <TableHead>Nome Instrutor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instrutores.map((instrutor) => (
                  <TableRow key={instrutor.instrutor_id}>
                    <TableCell>{instrutor.instrutor_id}</TableCell>
                    <TableCell>{instrutor.nome_instrutor}</TableCell>
                    <TableCell><Button variant={'destructive'}>Excluir</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Listar Alunos */}
      <div className="p-6 row-span-2 col-span-2 bg-white rounded-sm">
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
        </div>

        {/* Tabela */}
        <div className="flex-1 max-h-[500px] overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Aulas</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((user) => (
                <TableRow key={user.usuario_id}>
                  <TableCell>{user.usuario_id}</TableCell>
                  <TableCell className={"capitalize"}>{user.nome} {user.sobrenome}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>{user.telefone}</TableCell>
                  <TableCell>{user.categoria_pretendida}</TableCell>
                  <TableCell>{user.num_aulas}</TableCell>
                  <TableCell>{user.data_cadastro}</TableCell>
                  <TableCell>
                    <Button
                      className={'w-full'}
                      variant={user.atividade ? "green" : "destructive"}
                      onClick={() => handleAlterState(user)}>
                      {user.atividade ? "Ativo" : "Inativo"}
                    </Button>
                  </TableCell>
                  <TableCell className={'max-w-[100px]'}>
                    <Button className={'w-full'} variant={'alert'} onClick={() => startEdit(user)}>
                      Editar
                      <span className="material-icons">
                        edit
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
