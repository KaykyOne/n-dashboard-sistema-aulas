"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAlunos from "@/hooks/useAlunos";
import { toast } from "react-toastify";

export default function TransferenciasPage() {
  const { alunos, buscarAlunos, loading: loadingAlunos, transferenciaAluno } = useAlunos();
  const [usuarios, setUsuarios] = useState([]); // começa vazio
  const [id, setId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [loadingTransferencia, setLoadingTransferencia] = useState(false);

  useEffect(() => {
    buscarAlunos();
  }, []);

  const transferirAlunos = async () => {
    if (!id) {
      toast.error("Informe o ID da autoescola de destino");
      return;
    }
    if (usuarios.length === 0) {
      toast.error("Selecione pelo menos um aluno para transferir");
      return;
    }

    try {
      setLoadingTransferencia(true);
      for (let i = 0; i < usuarios.length; i++) {
        const res = await transferenciaAluno(usuarios[i].usuario_id, id);
        if(res == 'Transferência realizada com sucesso'){
          toast.success('Transferência realizada com sucesso');
        }
      }
      await buscarAlunos();
      setUsuarios([]);
    } catch (error) {
      console.error("Erro ao transferir:", error);
    } finally {
      setLoadingTransferencia(false);
    }
  };

  const adicionarUsuarioSelecionado = (aluno) => {
    const jaAdicionado = usuarios.find((u) => u.usuario_id === aluno.usuario_id);
    if (jaAdicionado || usuarios.length >= 20) return;

    setUsuarios((prev) => [
      ...prev,
      {
        usuario_id: aluno.usuario_id,
        telefone: aluno.telefone,
        nome: `${aluno.nome} ${aluno.sobrenome}`,
      },
    ]);
  };

  const removerUsuario = (telefone) => {
    setUsuarios((prev) => prev.filter((u) => u.telefone !== telefone));
  };

  const alunosFiltrados = alunos
    .filter((aluno) => aluno.atividade === true)
    .filter((aluno) =>
      `${aluno.nome} ${aluno.sobrenome}`
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      {/* Título e introdução */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">📤 Transferência de Alunos</h1>
        <p className="text-gray-600">
          Transfira alunos entre autoescolas por aqui!
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-col gap-4 anim-hover card">
        <label className="font-medium">Autoescola ID:</label>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          type="number"
          placeholder="Digite o ID da autoescola de destino"
        />

        <Button
          onClick={transferirAlunos}
          disabled={loadingTransferencia}
          className="w-fit gap-2"
        >
          {loadingTransferencia ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" />
          ) : (
            <>
              <span className="material-icons">swap_horiz</span>
              Alterar
            </>
          )}
        </Button>

        {/* Contador de usuários */}
        <p className="text-sm text-gray-600">
          Selecionados: <strong>{usuarios.length}</strong> / 20
        </p>

        {/* Lista de usuários selecionados */}
        <div className="flex flex-wrap gap-3">
          {usuarios.map((usuario) => (
            <div
              key={usuario.telefone}
              className="flex items-center justify-between bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-xl shadow-sm w-full max-w-md"
            >
              <h1 className="font-medium text-sm truncate">{usuario.nome}</h1>
              <span
                className="material-icons cursor-pointer hover:text-blue-900 transition"
                onClick={() => removerUsuario(usuario.telefone)}
              >
                remove
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filtro de pesquisa */}
      <input
        type="text"
        placeholder="Buscar aluno por nome ou sobrenome..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Lista de alunos */}
      <div className="max-h-[400px] overflow-auto space-y-3 anim-hover card">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Alunos ativos:</h2>
        {alunosFiltrados.map((aluno) => (
          <div
            key={aluno.usuario_id}
            className="border border-gray-200 rounded-md p-3 bg-gray-50"
          >
            <p className="text-sm text-gray-800 font-medium">
              {aluno.nome} {aluno.sobrenome}
            </p>
            <p className="text-sm text-gray-600">📞 {aluno.telefone}</p>
            <p className="text-sm text-gray-600">
              Categoria: {(aluno.categoria_pretendida || "").toUpperCase()}
            </p>
            <Button
              className="mt-2"
              onClick={() => adicionarUsuarioSelecionado(aluno)}
            >
              Adicionar
              <span className="material-icons">add</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
