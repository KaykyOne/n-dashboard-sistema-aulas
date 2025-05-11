import { useEffect, useState } from "react";
import { getToken } from '@/lib/utils';
import useGeneric from "@/hooks/useGeneric";

export default function useAula() {
    const { GenericDelete, GenericSearch, error, loading } = useGeneric();

    const [aulas, setAulas] = useState([]);
    const [vagas, setVagas] = useState([]);
    const [instrutor, setInstrutor] = useState();
    const [data, setData] = useState();

    async function buscarAulasInstrutor(id, data) {
        if (!id || !data) return;

        const [res1, res2] = await Promise.all([
            GenericSearch('adm', 'buscarAulasDoDiaInstrutor', `?id=${id}&data=${data}`),
            GenericSearch('adm', 'buscarHorariosVagos', `?id=${id}&data=${data}`)
        ])

        setAulas(res1 ? res1 : []);
        setVagas(res2 ? res2 : []);

    }
    useEffect(() => {
        buscarAulasInstrutor(instrutor, data)
    }, [instrutor, data])

    const deleteAula = async (id) => {
        const res = await GenericDelete("adm", id, 'removerAula', 'id');
        alert(res.message);
    }

    return { setInstrutor, instrutor, data, setData, aulas, loading, vagas, deleteAula, buscarAulasInstrutor };
}

