"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import useAlunos from "@/hooks/useAlunos";
import useInstrutores from "@/hooks/useInstrutores";
import Loading from "@/components/Loading";
import { format } from 'date-fns'
import { toast } from "react-toastify";

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

export default function AlunosPage() {

    //Buscar
    const {
        alunos: usuarios,
        loading,
        buscarAlunos,
        getInstrutoresResponsaveis,
        instrturesResponsaveis,
        inserirAluno,
        excluirAlunoInstrutor,
        inserirRelacao,
        alterAtividadeAluno,
        editarAluno } = useAlunos();

    const { buscarInstrutores, instrutores, loading: loadingInstrutor } = useInstrutores();

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
    const [instrutorResponsa, setInstrutorResponsa] = useState();

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

    const isNumeric = (str) => /^[0-9]+$/.test(str);

    const filtrarUsuarios = () => {

        const test = searchForAtv === "Inativo" ? false : true;
        const users = usuarios.filter((user) => {
            const matchName = searchForName === "" || user.nome.toLowerCase().includes(searchForName.toLowerCase());
            const matchCpf = searchForCPF === "" || user.cpf.includes(searchForCPF);
            const matchCat = searchForCat === "" || user.categoria_pretendida.toLowerCase().includes(searchForCat.toLowerCase());
            const matchForAtv = searchForAtv === "" || user.atividade == test;
            const userDate = new Date(user.data_cadastro).getMonth();
            const matchData = searchDataCadastro === "" || Number(searchDataCadastro) === userDate;
            return matchName && matchCpf && matchCat && matchForAtv && matchData;
        })
        console.log(users);
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
        setTelefone("");
        setCategoria("");
        setOutraCidade(false);
        setEditando(false);
    };
    const startEdit = (user) => {
        setEditando(true);
        setNome(user.nome);
        setSobrenome(user.sobrenome);
        setCpf(user.cpf);
        setCpfInstrutorResponsavel(user.cpf);
        setTelefone(user.telefone);
        let userCategoria = user.categoria_pretendida.toUpperCase();
        let categorias = userCategoria.split("");
        setCategoria(categorias);
        setOutraCidade(user.outra_cidade);
    };

    useEffect(() => {
        buscarAlunos();
    }, []);
    useEffect(() => {
        setUsuariosFiltrados(usuarios);
    }, [usuarios]);
    useEffect(() => {
        setNumPagina(0);
        if (searchForName == "" && searchForCPF == "" && searchForCat == "" && searchDataCadastro == "") {
            let test = searchForAtv == "Inativo" ? false : true;
            let users = usuarios.filter(user => user.atividade == test)
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
                telefone: telefone,
                categoria: categoriaFormat,
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
            setCategoria("");
            setOutraCidade(false);
            setValorCriar("");
            setDescicaoCriar("");
        }
    }
    const handleEdit = async () => {

        const test = testCampos();
        if (test && editando) {
            const categoriaFormat = categoria.join('');

            const aluno = ({
                nome: nome,
                sobrenome: sobrenome,
                cpf: cpf,
                telefone: telefone,
                categoria: categoriaFormat,
                outra_cidade: outraCidade,
            });

            await editarAluno(aluno);

            setNome("");
            setSobrenome("");
            setCpf("");
            setTelefone("");
            setCategoria("");
            setOutraCidade(false);
            setEditando(false);
            setCpfInstrutorResponsavel("")
            setInstrutorResponsa([])

            await buscarAlunos();
        }
    };

    const alterarNavegacao = (num) => {
        const val = numPagina + num;
        if (val >= 0 && (val - 10) <= usuariosFiltrados.length) {
            setNumPagina(val);
        }
    }

    return (
        <div className="relative">
            {loading || loadingInstrutor && <Loading />}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col col-span-2 p-6 bg-white rounded-sm gap-2">
                    <h1 className="font-bold text-3xl">{editando ? 'Editando' : 'Cadastrar'} Pré-Cadastro:</h1>

                    <Input type="text" placeholder="Nome" required maxLength={20} value={nome} onChange={(e) => setNome(e.target.value)} />
                    <Input type="text" placeholder="Sobrenome" required maxLength={20} value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
                    <Input type="text" placeholder="CPF" required minLength={11} maxLength={11} value={cpf} onChange={(e) => setCpf(e.target.value)} />
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
                    <Input type="text" placeholder="Telefone" required minLength={10} maxLength={11} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    <div className="flex gap-2">
                        <input type="checkbox" id="outraCidade" checked={outraCidade} onChange={(e) => setOutraCidade(e.target.checked)} />
                        <label className="font-bold" htmlFor="outraCidade">Outra Cidade(isso dará privilégio para o aluno)</label>
                    </div>
                    {!editando &&
                        <div className="border-gray-300 border-2 p-3 rounded-2xl">
                            <h1 className="text-2xl font-bold">Finaceiro Inicial</h1>
                            <div className='flex gap-2 pt-2'>
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
                            <h1 className='font-medium'>Descrição:</h1>
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
                    </div>

                    {/* Tabela */}
                    <div className="flex-1 overflow-auto">
                        <div className="flex flex-col">
                            {/* Cabeçalho */}
                            <div className="grid grid-cols-8 font-bold p-3 border-b bg-gray-100">
                                <p>Nome</p>
                                <p>CPF</p>
                                <p>Telefone</p>
                                <p>Categoria</p>
                                <p>Data Cadastro</p>
                                <p>Outra Cidade</p>
                                <p>Status</p>
                                <p>Ações</p>
                            </div>

                            {/* Lista */}
                            <div className="flex flex-col divide-y">
                                {usuariosFiltrados.filter((_, index) => index >= numPagina && index < numPagina + 10).map((user) => (
                                    <div
                                        key={user.usuario_id}
                                        className="grid grid-cols-8 items-center text-sm p-3"
                                    >
                                        <p className="capitalize">{user.nome} {user.sobrenome}</p>
                                        <p>{user.cpf.length > 11 ? "inviável" : user.cpf}</p>
                                        <p>{user.telefone}</p>
                                        <p>{user.categoria_pretendida.toUpperCase()}</p>
                                        <p>{format(user.data_cadastro, 'dd/MM/yyyy')}</p>
                                        <p>{user.outra_cidade ? "Sim" : "Não"}</p>
                                        <div className="p-1">
                                            <Button
                                                className="w-full"
                                                variant={user.atividade ? "green" : "destructive"}
                                                onClick={() => handleAlterState(user)}
                                            >
                                                {user.atividade ? "Ativo" : "Inativo"}
                                            </Button>
                                        </div>
                                        <div className="w-full p-1">
                                            <Button
                                                className="w-full"
                                                variant="alert"
                                                onClick={() => startEdit(user)}
                                            >
                                                Editar
                                                <span className="material-icons">edit</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center text-black">
                    <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(-10)}>
                        arrow_left
                    </span>
                    <div className="flex flex-col gap-1 justify-center items-center">
                        {`${numPagina} - ${numPagina + 10}`}
                    </div>
                    <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(10)}>
                        arrow_right
                    </span>
                </div>

            </div>
        </div>
    );
}
