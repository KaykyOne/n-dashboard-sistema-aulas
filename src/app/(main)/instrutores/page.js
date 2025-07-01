"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import useInstrutores from "@/hooks/useInstrutores";
import Loading from "@/components/Loading";
import useAlunos from "@/hooks/useAlunos";

const opcoesDeTipo = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

export default function InstrutoresPage() {
  const {
    buscarInstrutores,
    instrutores,
    cadastrarInstrutor,
    editarInstrutor,
    mudarAtividadeInstrutor,
    inserirInstrutor,
    loading,
  } = useInstrutores();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [categoria, setCategoria] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [outraCidade, setOutraCidade] = useState(false);

  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("18:00");
  const [inicioAlmoco, setInicioAlmoco] = useState("12:00");
  const [fimAlmoco, setFimAlmoco] = useState("13:00");

  useEffect(() => {
    const awaitInstrutores = async () => {
      await buscarInstrutores();
    }
    awaitInstrutores();
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    if (
      !nome ||
      !sobrenome ||
      !cpf ||
      !telefone ||
      categoria.length === 0 ||
      !horaInicio ||
      !horaFim ||
      !inicioAlmoco ||
      !fimAlmoco
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    const categoriaFormat = categoria.join("");

    const dados = {
      nome_instrutor: nome,
      tipo_instrutor: categoriaFormat,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      hora_inicio_almoco: inicioAlmoco,
      hora_fim_almoco: fimAlmoco,
    };

    if (editando) {
      // editar apenas o instrutor, sem criar novo usuário
      dados.instrutor_id = idEditando;
      const instrutorOriginal = instrutores.find(i => i.instrutor_id === idEditando);
      if (instrutorOriginal) {
        dados.atividade_instrutor = instrutorOriginal.atividade_instrutor;
        dados.usuario_id = instrutorOriginal.usuario_id;
      }
      await editarInstrutor(dados);
    } else {
      // criar usuário e depois cadastrar como instrutor
      const aluno = {
        nome,
        sobrenome,
        cpf,
        tipo: "instrutor",
        telefone,
        categoria: categoriaFormat,
        data_cadastro: new Date(),
        outra_cidade: outraCidade,
      };

      let res;
      try {
        res = await inserirInstrutor(aluno);
        console.log(res);
      } catch (err) {
        console.error("Erro ao inserir instrutor:", err);
        toast.error("Erro ao criar o usuário do instrutor.");
        return;
      }

      if (!res || !res.response[0].usuario_id) {
        toast.error("Resposta inválida ao criar o usuário do instrutor.");
        return;
      }

      dados.usuario_id = res.response[0].usuario_id;
      dados.atividade_instrutor = true;

      await cadastrarInstrutor(dados);
    }

    clear();
    await buscarInstrutores();
  };



  const clear = () => {
    setNome("");
    setSobrenome("");
    setCpf("");
    setTelefone("");
    setCategoria([]);
    setEditando(false);
    setIdEditando(null);
    setHoraInicio("08:00");
    setHoraFim("18:00");
    setInicioAlmoco("12:00");
    setFimAlmoco("13:00");
    setOutraCidade(false);
  };

  const startEdit = (instrutor) => {
    setEditando(true);
    setNome(instrutor.nome_instrutor);
    setCategoria(instrutor.tipo_instrutor);
    setIdEditando(instrutor.instrutor_id);
    setHoraInicio(instrutor.hora_inicio || "08:00");
    setHoraFim(instrutor.hora_fim || "18:00");
    setInicioAlmoco(instrutor.hora_inicio_almoco || "12:00");
    setFimAlmoco(instrutor.hora_fim_almoco || "13:00");
  };

  const toggleAtividade = async (instrutor) => {
    await mudarAtividadeInstrutor(instrutor.instrutor_id, !instrutor.atividade_instrutor);
    buscarInstrutores();
  };

  const handleCheckboxChange = (event, tipo) => {
    setCategoria((prev) => {
      if (event.target.checked) {
        return [...prev, tipo];
      } else {
        return prev.filter((item) => item !== tipo);
      }
    });
  };

  return (
    <div className="p-6">
      {loading && <Loading />}
      <h1 className="text-3xl font-bold mb-4">Gerenciar Instrutores</h1>

      <div className="flex flex-col gap-2 mb-6 bg-white p-2 rounded-sm">
        <h2 className="font-bold text-xl">{idEditando ? "Editando" : "Cadastrando"} Instrutor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input placeholder="Sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
          <Input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          <Input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
        <label className="font-medium">Categoria:</label>
        <div className="flex gap-4 flex-wrap">
          {opcoesDeTipo.map((tipo) => {
            const isChecked = categoria.includes(tipo.value);
            return (
              <div className="flex items-center gap-1" key={tipo.value}>
                <input
                  type="checkbox"
                  id={`tipo${tipo.value}`}
                  checked={isChecked}
                  onChange={(event) => handleCheckboxChange(event, tipo.value)}
                />
                <label htmlFor={`tipo${tipo.value}`} className="text-sm">{tipo.value}</label>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} placeholder="Hora Início" />
          <Input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} placeholder="Hora Fim" />
          <Input type="time" value={inicioAlmoco} onChange={(e) => setInicioAlmoco(e.target.value)} placeholder="Início Almoço" />
          <Input type="time" value={fimAlmoco} onChange={(e) => setFimAlmoco(e.target.value)} placeholder="Fim Almoço" />
        </div>

        <div className="flex gap-2 mt-2">
          <Button onClick={handleSubmit}>{editando ? "Salvar Edição" : "Cadastrar"}</Button>
          {editando && <Button variant="destructive" onClick={clear}>Cancelar</Button>}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Hora Início</TableHead>
            <TableHead>Hora Fim</TableHead>
            <TableHead>Início Almoço</TableHead>
            <TableHead>Fim Almoço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(instrutores) && instrutores.map((instrutor) => (
            <TableRow key={instrutor.instrutor_id}>
              <TableCell>{instrutor.nome_instrutor}</TableCell>
              <TableCell>{instrutor.tipo_instrutor}</TableCell>
              <TableCell>{instrutor.hora_inicio?.slice(0, 5) || "--:--"}</TableCell>
              <TableCell>{instrutor.hora_fim?.slice(0, 5) || "--:--"}</TableCell>
              <TableCell>{instrutor.hora_inicio_almoco?.slice(0, 5) || "--:--"}</TableCell>
              <TableCell>{instrutor.hora_fim_almoco?.slice(0, 5) || "--:--"}</TableCell>
              <TableCell>{instrutor.atividade_instrutor ? "Ativo" : "Inativo"}</TableCell>
              <TableCell className="flex gap-2">
                <Button onClick={() => startEdit(instrutor)}>Editar</Button>
                <Button
                  variant={instrutor.atividade_instrutor ? "destructive" : "green"}
                  onClick={() => toggleAtividade(instrutor)}
                >
                  {instrutor.atividade_instrutor ? "Desativar" : "Ativar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
