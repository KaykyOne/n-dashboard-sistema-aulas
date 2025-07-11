"use client"
import { useEffect, useState } from "react";
import useAlunos from "@/hooks/useAlunos";
import useAula from "@/hooks/useAulas";
import { Button } from "./ui/button";
import Loading from "./Loading";
import Modal from "./Modal";

export default function ModalAulas({ onClose, idAluno }) {
  const { aulas, searchAulas, loading } = useAlunos();
  const { deleteAula, loading: loaginAulas } = useAula();
  const [numPages, setNumPages] = useState(0);
  const [modalContent, setModalContent] = useState("");

  const confirmDeleteAula = async (id) => {
    if (!id) return;
    setModalContent(
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tem certeza que deseja excluir esta aula?
        </h1>

        <img
          src="/imageDelete.svg"
          alt="Ícone de exclusão"
          className="max-w-[200px] w-full h-auto"
        />

        <div className="flex gap-3 mt-4">
          <Button
            variant="green"
            className="flex items-center gap-2"
            onClick={async () => {
              await deleteAula(id);
              await searchAulas(idAluno);
              setModalContent("");
            }}
          >
            <span className="material-icons">check_circle</span>
            Confirmar
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setModalContent("")}
          >
            <span className="material-icons">cancel</span>
            Cancelar
          </Button>
        </div>
      </div>
    )

    return;
  }

  useEffect(() => {
    const buscarAulas = async () => {
      if (!idAluno) return;
      await searchAulas(idAluno);
    }
    buscarAulas();
  }, [idAluno])

  const alterarNavegacao = (num) => {
    const val = numPages + num;
    if (val >= 0 && (val - 10) <= (aulas || []).length) {
      setNumPages(val);
    }
  };

  return (
    <div className="fixed flex inset-0 h-full w-full bg-black/50 justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl relative">
        {(loading || loaginAulas) && <Loading />}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
        >✕</button>

        <h1 className="text-2xl font-bold p-2">Aulas</h1>
        <h1 className="text-xl font-medium">Total de aulas: {(aulas || []).length}</h1>
        <div className="flex flex-col h-[50vh] overflow-auto">
          <div className="grid grid-cols-6 text-black font-medium bg-gray-200  items-start">
            <h1 className="flex flex-1 border border-white justify-center">Data</h1>
            <h1 className="flex flex-1 border border-white justify-center">Hora</h1>
            <h1 className="flex flex-1 border border-white justify-center">Instrutor</h1>
            <h1 className="flex flex-1 border border-white justify-center">Veiculo</h1>
            <h1 className="flex flex-1 border border-white justify-center">Tipo</h1>
            <h1 className="flex flex-1 border border-white justify-center">Excluir</h1>
          </div>
          <div className="flex flex-col gap-1">
            {(aulas.length === 0) ? (
              <div className="flex flex-1 text-center py-10 justify-center">
                <h1 className="text-3xl font-black">Sem Aulas!</h1>
              </div>
            ) : (
              aulas
                .filter((_, index) => index >= numPages && index < numPages + 10)
                .map((item) => (
                  <div className="grid grid-cols-6 items-start" key={item.aula_id}>
                    <h1 className="flex flex-1 border border-white justify-center">{item.data}</h1>
                    <h1 className="flex flex-1 border border-white justify-center">{item.hora}</h1>
                    <h1 className="flex flex-1 border border-white justify-center">{item.nome_instrutor}</h1>
                    <h1 className="flex flex-1 border border-white justify-center">{item.placa}</h1>
                    <h1 className="flex flex-1 border border-white justify-center">{item.tipo}</h1>
                    <Button
                      type="destructive"
                      className="flex-1"
                      onClick={() => confirmDeleteAula(item.aula_id)}
                    >
                      Excluir
                    </Button>
                  </div>
                ))
            )}

          </div>

        </div>
        <div className="flex justify-center items-center text-black">
          <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(-10)}>
            arrow_left
          </span>
          <div className="flex flex-col gap-1 justify-center items-center">
            {`${(numPages / 10)} - ${((aulas || []).length / 10).toFixed(0)}`}
          </div>
          <span className="material-icons !text-5xl cursor-pointer" onClick={() => alterarNavegacao(10)}>
            arrow_right
          </span>
        </div>
        {modalContent &&
          <Modal onClose={() => setModalContent("")}>
            {modalContent}
          </Modal>}
      </div>
    </div>
  );
}


