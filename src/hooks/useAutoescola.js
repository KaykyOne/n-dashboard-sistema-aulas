"use client"
import { useState } from 'react'
import useGeneric from './useGeneric'
import { toast } from 'react-toastify';

export default function useAutoescola() {
  const [autoescolas, setAutoescolas] = useState([]);
  const { GenericSearch, GenericPath, loading } = useGeneric();

  const searchAllAutoecolas = async (autoescola_id) => {
    try {
      const pesquisa = `?autoescola_id=${autoescola_id}`;
      const res = await GenericSearch("adm", "autoescolasBuscar", pesquisa);

      if (!res || !res.result) {
        throw new Error(res?.error || "Erro ao buscar autoescolas");
      }

      setAutoescolas(res.result);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      setAutoescolas([]);
    }
  };

  const getConfigs = async () => {
    try {
      const id = sessionStorage.getItem("id_autoescola");
      if (!id) throw new Error("ID da autoescola não encontrado");

      const configs = await GenericSearch('adm', 'buscarConfigs', `?autoescola_id=${id}`);

      if (!configs) throw new Error("Erro ao buscar configurações");

      return configs;
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      return null;
    }
  };

  const updateConfig = async (id, valor) => {
    if (loading) return;
    try {
      const payload = {
        id_configuracao: Number(id),
        novo_valor: valor,
      };

      const res = await GenericPath("adm", "atualizarConfig", "", payload);
      console.log(res)

      if (res?.message) {
        toast.success(res.mensagem);
        return;
      } else {
        throw new Error(res?.error || "Erro ao atualizar configuração");
      }
    } catch (erro) {
      toast.error(erro.message || erro.toString());
    }
  };

  return {
    searchAllAutoecolas,
    getConfigs,
    updateConfig,
    autoescolas,
    loading,
  };
}
