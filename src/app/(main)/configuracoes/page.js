'use client'

import React, { useEffect, useState } from 'react'
import useAutoescola from '@/hooks/useAutoescola'
import Loading from '@/components/Loading'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ConfiguracoesPage() {
  const { getConfigs, updateConfig, loading } = useAutoescola()
  const [configs, setConfigs] = useState([])
  const [valores, setValores] = useState({})
  const [editandoId, setEditandoId] = useState(null)

  // carrega configs

  const fetchConfigs = async () => {
    const res = await getConfigs()
    setConfigs(res || [])

    const inicial = {}
    res?.forEach((cfg) => {
      inicial[cfg.id_configuracao] = cfg.valor
    })
    setValores(inicial)
    setEditandoId(null)
  };

  useEffect(() => {
    if(loading) return;
    fetchConfigs()
  }, []);

  const handleChange = (id, novoValor) => {
    if (editandoId === null || editandoId === id) {
      setEditandoId(id)
      setValores((prev) => ({
        ...prev,
        [id]: novoValor
      }))
    }
  };

  const salvar = async (id) => {
    await updateConfig(id, valores[id])
    setEditandoId(null)
  };

  const descartar = () => {
    fetchConfigs()
    toast.info('Alterações descartadas.')
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="flex flex-col">
        <h1 className="text-4xl font-bold">Configurações</h1>
        <p className="text-gray-600">Aqui você pode mudar como o sistema funciona!</p>
      </header>

      <div className='bg-white p-3 rounded-2xl shadow anim-hover'>
        <h1 className='text-xl font-semibold'>Alterar Senha:</h1>
        <p className='text-sm font-light'>Altere sua senha aqui! coloque a atual, e a nova!</p>
        <h2 className='text-lg font-medium'>Senha Atual:</h2>
        <Input>

        </Input>
        <h2 className='text-lg font-medium'>Nova Senha:</h2>
        <Input>

        </Input>
        <Button className={'mt-3 w-full'}>
          Confirmar
          <span className="material-icons">
            done
          </span>
        </Button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5 w-full">
          {configs.length > 0 ? (
            configs.map((item) => {
              const estaEditando = editandoId === item.id_configuracao
              return (
                <div
                  key={item.id_configuracao}
                  className="flex flex-col gap-2 w-full bg-white p-5 rounded-2xl shadow anim-hover"
                >
                  <div className="flex items-center gap-2">
                    <label className="font-medium capitalize whitespace-nowrap w-1/3">
                      {item.chave.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {item.chave === 'manutencao' ?
                        <input    
                          type='checkbox'
                          className="border border-gray-300 rounded px-3 py-1 w-2/3"
                          checked={item.valor == 'TRUE' || valores[item.id_configuracao] == 'TRUE'}
                          onChange={(e) =>
                            handleChange(item.id_configuracao, e.target.checked ? 'TRUE' : 'FALSE')
                          }
                          disabled={editandoId !== null && !estaEditando}
                        />
                      : <input
                        className="border border-gray-300 rounded px-3 py-1 w-2/3"
                        value={valores[item.id_configuracao] || ''}
                        onChange={(e) =>
                          handleChange(item.id_configuracao, e.target.value)
                        }
                        disabled={editandoId !== null && !estaEditando}
                      />}
                  </div>

                  {estaEditando && (
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded"
                        onClick={() => salvar(item.id_configuracao)}
                      >
                        Salvar
                      </button>
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded"
                        onClick={descartar}
                      >
                        Descartar
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-gray-500">Nenhuma configuração disponível.</p>
          )}
        </div>
      )}
    </div>
  )
}
