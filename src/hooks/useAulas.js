"use client"
import { useEffect, useState } from "react";
import useGeneric from "@/hooks/useGeneric";
import { toast } from "react-toastify";

export default function useAula() {
    const { GenericDelete, GenericSearch, GenericCreate, GenericPath, error, loading } = useGeneric();
    const [aulas, setAulas] = useState([]);
    const [vagas, setVagas] = useState([]);
    const [instrutor, setInstrutor] = useState();
    const [data, setData] = useState(new Date());

    async function buscarAulasInstrutor(id_instrutor, data) {
        const id = sessionStorage.getItem("id_autoescola");
        const [res1, res2] = await Promise.all([
            GenericSearch('adm', 'buscarAulasDoDiaInstrutor', `?id=${id_instrutor}&data=${data}&autoescola_id=${id}`),
            GenericSearch('adm', 'buscarHorariosVagos', `?id=${id_instrutor}&data=${data}&autoescola_id=${id}`)
        ])

        setAulas(res1 || []);
        setVagas(res2 || []);
    }

    async function testAulas(aluno_id, data, tipo, marcada_por) {
        const id = sessionStorage.getItem("id_autoescola");
        const pesquisa = `?aluno_id=${aluno_id}&data=${data}&tipo=${tipo}&marcada_por=${marcada_por}&autoescola_id=${id}`;
        const res = await GenericSearch('aulas', 'testAula', pesquisa);
        return res;
    }

    async function buscarHorariosLivres(id_instrutor, veiculo_id, dataA) {
        const res = await GenericSearch('aulas', 'buscarHorarioLivre', `?instrutor_id=${id_instrutor}&veiculo_id=${veiculo_id}&data=${dataA}`)
        const horariosParaSelecao = res.map((i) => ({
            value: i,
            label: i,
        }));
        setVagas(horariosParaSelecao || []);
    }

    const InsertClass = async (aula) => {
        const id = sessionStorage.getItem("id_autoescola");
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
        if (res) {
            buscarAulasInstrutor(instrutor, data);
        }
    }

    const alterarAula = async (id1, hora1, id2, hora2) => {
        try {
            const att = `?id1=${id1}&hora1=${hora1}&id2=${id2}&hora2=${hora2}`;
            const response = await GenericPath('aulas', 'trocarHorarios', att);
            console.log(response);
            if (response.sucesso == true) {
                toast.success("Aula auterada com sucesso!");
                return true;
            } else {
                toast.error(`Erro, não é possivel mudar as aulas, os veiculos ou alunos estão em aulas iguais`);
                return false;
            }
        } catch (error) {
            toast.error(error);
            return false;
        }
    }

    return { setInstrutor, instrutor, data, setData, aulas, loading, vagas, deleteAula, buscarAulasInstrutor, buscarHorariosLivres, InsertClass, alterarAula, testAulas };
}

