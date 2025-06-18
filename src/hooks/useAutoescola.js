"use client"
import { useState, useEffect } from 'react'
import useGeneric from './useGeneric'

export default function useAutoescola() {
    const [autoescolas, setAutoescolas] = useState([]);

    const { GenericSearch, loading, error } = useGeneric();

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

    return { searchAllAutoecolas, getConfigs, autoescolas, loading, error }
}
