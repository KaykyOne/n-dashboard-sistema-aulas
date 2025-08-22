import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";


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

export default function ModalAlunos({
    editando,
    setEditando,
    idEdit,
    setIdEdit,
    cpfInstrutorResponsavel,
    setCpfInstrutorResponsavel,
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    categoria,
    setCategoria,
    outraCidade,
    setOutraCidade,
    instrutorResponsa,
    setInstrutorResponsa,
    dataCadastro,
    setDataCadastro,
    tipoUsuario,
    instrturesResponsaveis,
    inserirAluno,
    excluirAlunoInstrutor,
    inserirRelacao,
    setTipoUsuario,
    instrutores
}) {
    //Transacao
    const [valorCriar, setValorCriar] = useState("");
    const [descricaoCriar, setDescicaoCriar] = useState("");

    const isNumeric = (str) => /^[0-9]+$/.test(str);

    const instrutoresOptions = (instrutores || []).filter(i => i.atividade_instrutor == true).map((i) => ({
        value: i.instrutor_id.toString(),
        label: i.nome_instrutor,
    }));


    const handleDeleteRelation = async (instrutor) => {
        await excluirAlunoInstrutor(cpfInstrutorResponsavel, instrutor.instrutor_id);
    };
    const handleCreateRelation = async () => {
        if (!cpfInstrutorResponsavel || cpfInstrutorResponsavel === "") return;
        await inserirRelacao(cpfInstrutorResponsavel, instrutorResponsa);
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
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Form de cadastro */}
            <div className="flex flex-col col-span-2 p-6 bg-white rounded-sm gap-2">
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
    )
}
