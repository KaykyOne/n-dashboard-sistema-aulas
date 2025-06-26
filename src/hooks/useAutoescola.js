"use client"
import { useState, useEffect } from 'react'
import useGeneric from './useGeneric'

export default function useAutoescola() {
    const [autoescolas, setAutoescolas] = useState([]);

    const { GenericSearch, GenericPath, loading, error } = useGeneric();

    let id
    useEffect(() => {
        id = sessionStorage.getItem("id_autoescola");
    });

    const searchAllAutoecolas = async (autoescola_id) => {
        const pesquisa = `?autoescola_id=${autoescola_id}`;
        const res = await GenericSearch("adm", "autoescolasBuscar", pesquisa)
        console.log(res.result);
        setAutoescolas(res.result);
    }

    const getConfigs = async () => {
        const configs = await GenericSearch('adm', 'buscarConfigs', `?autoescola_id=${id}`);
        console.log(configs);
        return configs;
    }

    const updateConfig = async (id, valor) => {
        const res = await GenericPath("adm", "atualizarConfig", "", { id_configuracao: +id, novo_valor: valor})
        console.log(res);
    }

    return { searchAllAutoecolas, getConfigs, updateConfig, autoescolas, loading, error }
}
