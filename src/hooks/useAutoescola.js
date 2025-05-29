import { useState } from 'react'
import useGeneric from './useGeneric'

export default function useAutoescola() {
    const [autoescolas, setAutoescolas] = useState([]);

    const { GenericSearch, loading, error } = useGeneric();

    const searchAllAutoecolas = async (autoescola_id) => {
        const pesquisa = `?autoescola_id=${autoescola_id}`;
        const res = await GenericSearch("adm", "autoescolasBuscar", pesquisa)
        console.log(res.result);
        setAutoescolas(res.result);
    }

    return {searchAllAutoecolas, autoescolas, loading, error }
}
