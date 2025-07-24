"use client"

import React, { useState } from 'react'
import ListAulasInstrutor from '@/components/ListAulasInstrutor'
import { Button } from '@/components/ui/button'
import useAula from '@/hooks/useAulas'

export default function Page() {
  const aula1 = useAula()
  const aula2 = useAula()

  const [doisInstrutores, setDoisInstrutores] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [aulaDrag, setAulaDrag] = useState()
  const [modalContent, setModalContent] = useState()

  const dragIniti = (aula, index) => {
    setAulaDrag({ aula, index })
  }

  const confirmDrop = (aula, index) => {
    setModalVisible(true)
    setModalContent(
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tem certeza que deseja trocar essas aulas?
        </h1>
        <img
          src="/imagemAlterar.svg"
          alt="Ícone de alteração"
          className="max-w-[200px] w-full h-auto"
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="green"
            className="flex items-center gap-2"
            onClick={async () => {
              setModalVisible(false)
              await dragDrop(aula, index)
            }}
          >
            <span className="material-icons">check_circle</span>
            Confirmar
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setModalVisible(false)}
          >
            <span className="material-icons">cancel</span>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  const dragDrop = async (aulaSoltada) => {

    if (!aulaDrag || !aulaDrag.aula) return

    const aulaArrastada = aulaDrag.aula
    console.log(aulaSoltada);
    console.log(aulaArrastada);

    // Verifica de qual lista (hook) vem a aula arrastada
    const vemDeAula1 = aula1.aulas.some(a => a.aula_id === aulaArrastada.aula_id)
    const hookOrigem = vemDeAula1 ? aula1 : aula2
    const hookDestino = vemDeAula1 ? aula2 : aula1

    let id_instrutor1 = hookOrigem.instrutor;
    let id_instrutor2 = hookDestino.instrutor;

    if (id_instrutor1 && id_instrutor2) {
      const res = await hookOrigem.alterarAula(
        aulaSoltada.aula_id || 'vago',
        aulaSoltada.hora,
        id_instrutor2 || 'vago',
        aulaArrastada.aula_id || 'vago',
        aulaArrastada.hora,
        id_instrutor1 || 'vago',
      )

      await hookOrigem.buscarAulasInstrutor();
      await hookDestino.buscarAulasInstrutor();
    } else {
      if (id_instrutor1) {
        const res = await hookOrigem.alterarAula(
          aulaSoltada.aula_id || 'vago',
          aulaSoltada.hora,
          id_instrutor1 || 'vago',
          aulaArrastada.aula_id || 'vago',
          aulaArrastada.hora,
          id_instrutor1 || 'vago',
        )
        await hookOrigem.buscarAulasInstrutor();

      } else {
        const res = await hookDestino.alterarAula(
          aulaSoltada.aula_id || 'vago',
          aulaSoltada.hora,
          id_instrutor2 || 'vago',
          aulaArrastada.aula_id || 'vago',
          aulaArrastada.hora,
          id_instrutor2 || 'vago',
        )
        await hookDestino.buscarAulasInstrutor();
      }


    }
    setAulaDrag(null)
  }


  return (
    <div className='flex'>
      <div className='flex-1'>
        <ListAulasInstrutor
          dragIniti={dragIniti}
          dragDrop={dragDrop}
          confirmDrop={confirmDrop}
          modalVisibleDrag={modalVisible}
          modalContentDrag={modalContent}
          aulasMarcadas={aula1.aulas}
          horariosVagos={aula1.vagas}
          loadingAulas={aula1.loading}
          setData={aula1.setData}
          setInstrutor={aula1.setInstrutor}
          instrutor={aula1.instrutor}
          data={aula1.data}
          deleteAula={aula1.deleteAula}
          buscarAulasInstrutor={aula1.buscarAulasInstrutor}
        />
      </div>

      <div className='p-1 pl-2'>
        <Button className={'h-full'} onClick={() => setDoisInstrutores(!doisInstrutores)}>
          {doisInstrutores ? '-' : '+'}
        </Button>
      </div>

      {doisInstrutores && (
        <div className='flex-1'>
          <ListAulasInstrutor
            dragIniti={dragIniti}
            dragDrop={dragDrop}
            confirmDrop={confirmDrop}
            modalVisibleDrag={modalVisible}
            modalContentDrag={modalContent}
            aulasMarcadas={aula2.aulas}
            horariosVagos={aula2.vagas}
            loadingAulas={aula2.loading}
            setData={aula2.setData}
            setInstrutor={aula2.setInstrutor}
            instrutor={aula2.instrutor}
            data={aula2.data}
            deleteAula={aula2.deleteAula}
            buscarAulasInstrutor={aula2.buscarAulasInstrutor}
          />
        </div>
      )}
    </div>
  )
}
