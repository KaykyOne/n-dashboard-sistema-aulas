"use client"
import { useEffect, useState } from "react";
import useGeneric from "@/hooks/useGeneric";
import { toast } from "react-toastify";

export default function useAula() {
    const { GenericDelete, GenericSearch, GenericCreate, error, loading } = useGeneric();
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
    }

    async function inserirAula(aula) {
        const { resJSON, res } = await GenericCreate("aulas", "inserirAula", aula);
        console.log(res);
        console.log(resJSON);
        if (res.status === 200) {
            toast.success("Aula Inserida com sucesso!");
        } else {
            console.error(error);
            toast.error("Erro ao inserir Aula!");
        }
    }

    async function buscarHorariosLivres(id_instrutor, veiculo_id, dataA) {
        console.log(id_instrutor)
        console.log(veiculo_id)
        console.log(dataA)

        const res = await GenericSearch('aulas', 'buscarHorarioLivre', `?instrutor_id=${id_instrutor}&veiculo_id=${veiculo_id}&data=${dataA}`)
        const horariosParaSelecao = res.map((i) => ({
            value: i,
            label: i,
        }));
        setVagas(horariosParaSelecao || []);
    }

    const InsertClass = async (aula) => {

        const configs = await GenericSearch('adm', 'buscarConfigs', `?autoescola_id=${id}`);

        aula.autoescola_id = id;
        aula.configuracoes = configs;

        const {
            instrutor_id,
            aluno_id,
            data,
            tipo,
            hora,
            veiculo_id,
            autoescola_id,
            marcada_por,
            configuracoes,
        } = aula;

        // console.log({
        //     instrutor_id,
        //     aluno_id,
        //     data,
        //     tipo,
        //     hora,
        //     veiculo_id,
        //     autoescola_id,
        //     marcada_por,
        //     configuracoes
        // });

        if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id || !marcada_por || !configuracoes) {
            toast.error("Todos os campos obrigatórios devem ser preenchidos!");
            return false;
        }

        const { resJSON, res } = await GenericCreate('aulas', 'inserirAula', aula);
        console.log(resJSON);
        console.log(res);

        if (res.ok) {
            toast.success(resJSON.message);
            return res;
        } else {
            toast.error(resJSON.message);
            return res;
        }
    };

    useEffect(() => {
        if (!instrutor || !data) return;
        buscarAulasInstrutor(instrutor, data);
    }, [instrutor, data]);

    const deleteAula = async (id) => {
        const res = await GenericDelete("adm", id, 'removerAula', 'id');
        toast.info(res.message);
    }

    return { setInstrutor, instrutor, data, setData, aulas, loading, vagas, deleteAula, buscarAulasInstrutor, inserirAula, buscarHorariosLivres, InsertClass };
}

