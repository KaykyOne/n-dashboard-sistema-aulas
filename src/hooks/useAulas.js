"use client"
import { useEffect, useState } from "react";
import useGeneric from "@/hooks/useGeneric";
import { toast } from "react-toastify";

export default function useAula() {
    const { GenericDelete, GenericSearch, error, loading } = useGeneric();
    let id
    useEffect(() => {
        id = sessionStorage.getItem("id_autoescola"); 
    }) 
    const [aulas, setAulas] = useState([]);
    const [vagas, setVagas] = useState([]);
    const [instrutor, setInstrutor] = useState();
    const [data, setData] = useState(new Date());

    async function buscarAulasInstrutor(id_instrutor, data) {
        console.log(`ROla: ${id}`)
        const [res1, res2] = await Promise.all([
            GenericSearch('adm', 'buscarAulasDoDiaInstrutor', `?id=${id_instrutor}&data=${data}&autoescola_id=${id}`),
            GenericSearch('adm', 'buscarHorariosVagos', `?id=${id_instrutor}&data=${data}&autoescola_id=${id}`)
        ])

        setAulas(res1 || []);
        setVagas(res2 || []);
        console.log(res1);
        console.log(res2);
    }

    useEffect(() => {
        if (!instrutor || !data) return;
        buscarAulasInstrutor(instrutor, data);
    }, [instrutor, data]);

    const deleteAula = async (id) => {
        const res = await GenericDelete("adm", id, 'removerAula', 'id');
        toast.info(res.message);
    }

    return { setInstrutor, instrutor, data, setData, aulas, loading, vagas, deleteAula, buscarAulasInstrutor };
}

