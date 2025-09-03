"use client"
import React, { useEffect, useState } from "react";
import useMensagens from "@/hooks/useMensagens";
import { Button } from "@/components/ui/button";
import useAlunos from "@/hooks/useAlunos";

export default function EnvioMensagensPage() {
  const { inserirMensagem, setUsuarios, usuarios, loading: loadingMensagens } = useMensagens();
  const { alunos, buscarAlunos, loading: loadingAlunos } = useAlunos();
  const [text, setText] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    buscarAlunos();
  }, []);

  const enviarMensagens = async () => {
    setUsuarios(usuarios);
    await inserirMensagem(text || "Essa é uma mensagem automatica!");
  };

  const adicionarUsuarioSelecionado = (aluno) => {
    const alunoFormatado = {
      telefone: aluno.telefone,
      nome: `${aluno.nome} ${aluno.sobrenome}`,
    };
    setUsuarios((prev) => {
      const jaAdicionado = prev.find((u) => u.telefone === aluno.telefone);
      if (jaAdicionado || prev.length >= 20) return prev;
      return [...prev, alunoFormatado];
    });
  };

  const removerUsuario = (telefone) => {
    setUsuarios((prev) => prev.filter((u) => u.telefone !== telefone));
  };

  const selectionarTodos = (tipo) => {
    if (tipo === 'precadastros') {
      const precadastros = alunos.filter(item => item.tipo_usuario === 'precadastro');
      const filtrados = precadastros.filter(item => item.atividade === true);
      setUsuarios(filtrados);

    } else if (tipo === 'categorias') {
      const categorias = alunos.filter(item =>
        item.categoria_pretendida && item.categoria_pretendida.trim() !== "" &&
        (item.categoria_pretendida.toLowerCase() === 'd' || item.categoria_pretendida.toLowerCase() === 'e')
      );
      const filtrados = categorias.filter(item => item.atividade === true);
      setUsuarios(filtrados);

    } else if (tipo === 'primeiras') {
      const primeiras = alunos.filter(item =>
        item.categoria_pretendida && item.categoria_pretendida.trim() !== "" &&
        (item.categoria_pretendida.toLowerCase() === 'a' ||
          item.categoria_pretendida.toLowerCase() === 'b' ||
          item.categoria_pretendida.toLowerCase() === 'ab')
      );
      const filtrados = primeiras.filter(item => item.atividade === true);
      setUsuarios(filtrados);
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-800">📤 Envio de Mensagens em Massa</h1>
        <p className="text-gray-600">
          Envie mensagens para vários alunos de forma rápida e automatizada.
        </p>
      </div>

      {/* Alerta */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
        <p className="text-yellow-800 font-semibold">⚠️ Aviso importante:</p>
        <p className="text-yellow-700 mt-1">
          O envio é feito para no máximo <strong>20 alunos</strong>, e pode ser usado até <strong>2 vezes por dia</strong>, com intervalo de 30 minutos.
        </p>
        <p className="text-yellow-700 mt-2 font-medium">
          A NovusTech não se responsabiliza pelo conteúdo enviado nessas mensagens.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex flex-col gap-4 anim-hover card">
        <label className="font-medium text-gray-800">Digite a mensagem:</label>
        <textarea
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex: Olá! Suas aulas estão marcadas..."
        ></textarea>

        <div className="flex gap-2">
          <Button
            onClick={enviarMensagens}
            disabled={loadingMensagens}
            className="w-fit gap-2"
          >
            {loadingMensagens ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" />
            ) : (
              <>
                <span className="material-icons">send</span>
                Enviar
              </>
            )}
          </Button>

          <Button
            onClick={() => setUsuarios([])}
            disabled={loadingMensagens}
            className="w-fit gap-2"
          >
            <span className="material-icons">cleaning_services</span>
            Limpar
          </Button>
        </div>

        {/* Contador de usuários */}
        <p className="text-sm text-gray-600">Selecionados: <strong>{usuarios.length}</strong> / 20</p>

        {/* Lista de usuários selecionados */}
        <div className="flex flex-wrap gap-3">
          {(usuarios || []).map((usuario, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl shadow-sm w-full max-w-md"
            >
              <h1 className="font-medium text-sm truncate">{usuario.nome}</h1>
              <span
                className="material-icons cursor-pointer hover:text-red-900 transition"
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
      <div className="flex flex-wrap gap-2 justify-between">
        <button className="border p-2 cursor-pointer rounded-md flex-1 font-bold hover:text-amber-900 hover:bg-amber-500 transition duration-500" onClick={() => selectionarTodos('precadastros')}>Somente Pré-Cadastro</button>
        <button className="border p-2 cursor-pointer rounded-md flex-1 font-bold hover:text-amber-900 hover:bg-amber-500 transition duration-500" onClick={() => selectionarTodos('primeiras')}>Somente Primeira Habilitação</button>
        <button className="border p-2 cursor-pointer rounded-md flex-1 font-bold hover:text-amber-900 hover:bg-amber-500 transition duration-500" onClick={() => selectionarTodos('categorias')}>Somente Mudança de Categoria Alta</button>
      </div>

      {/* Lista de alunos */}
      <div className="p-4 max-h-[400px] overflow-auto space-y-3 anim-hover card">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Alunos ativos:</h2>
        {alunosFiltrados.map((aluno) => (
          <div
            key={aluno.usuario_id}
            className="border border-gray-200 rounded-md p-3 bg-gray-50"
          >
            <p className="text-sm text-gray-800 font-medium">{aluno.nome} {aluno.sobrenome}</p>
            <p className="text-sm text-gray-600">📞 {aluno.telefone}</p>
            <p className="text-sm text-gray-600">
              Categoria: {(aluno.categoria_pretendida || "").toUpperCase()}
            </p>
            <Button className="mt-2" onClick={() => adicionarUsuarioSelecionado(aluno)}>
              Adicionar
              <span className="material-icons">add</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
