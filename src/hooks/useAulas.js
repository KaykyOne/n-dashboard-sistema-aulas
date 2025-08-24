"use client"
import { useEffect, useState } from "react";
import useGeneric from "@/hooks/useGeneric";
import { toast } from "react-toastify";


export default function useAula() {
  const {
    GenericDelete,
    GenericSearch,
    GenericCreate,
    GenericPath,
    loading,
  } = useGeneric();

  const [aulas, setAulas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [autoescola_id, setAutoescola_id] = useState(0);
  const [instrutor, setInstrutor] = useState();
  const [data, setData] = useState(new Date());

  async function buscarAulasInstrutor() {
    const id = sessionStorage.getItem("id_autoescola");
    try {
      const [res1, res2] = await Promise.all([
        GenericSearch('adm', 'buscarAulasDoDiaInstrutor', `?id=${instrutor}&data=${data}&autoescola_id=${id}`),
        GenericSearch('adm', 'buscarHorariosVagos', `?id=${instrutor}&data=${data}&autoescola_id=${id}`)
      ]);

      setAulas(res1 || []);
      setVagas(res2 || []);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      setAulas([]);
      setVagas([]);
    }
  };

  async function testAulas(aluno_id, data, tipo, marcada_por) {
    const id = sessionStorage.getItem("id_autoescola");
    try {
      const pesquisa = `?aluno_id=${aluno_id}&data=${data}&tipo=${tipo}&marcada_por=${marcada_por}&autoescola_id=${id}`;
      const res = await GenericSearch('aulas', 'testAula', pesquisa);
      return res;
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      return null;
    }
  };

  async function buscarHorariosLivres(id_instrutor, veiculo_id, dataA) {
    try {
      const res = await GenericSearch('aulas', 'buscarHorarioLivre', `?instrutor_id=${id_instrutor}&veiculo_id=${veiculo_id}&data=${dataA}`);
      const horariosParaSelecao = (res || []).map((i) => ({
        value: i,
        label: i,
      }));
      setVagas(horariosParaSelecao);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      setVagas([]);
    }
  };

  const InsertClass = async (aula) => {
    try {
      const id = sessionStorage.getItem("id_autoescola");
      aula.autoescola_id = id;

      const configs = await GenericSearch('adm', 'buscarConfigs', `?autoescola_id=${id}`);
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

      if (!instrutor_id || !aluno_id || !data || !tipo || !hora || !veiculo_id || !autoescola_id || !marcada_por || !configuracoes) {
        toast.error("Todos os campos obrigatórios devem ser preenchidos!");
        return false;
      }

      const { resJSON, res } = await GenericCreate('aulas', 'inserirAula', aula);

      if (res.ok) {
        toast.success(resJSON.message);
        return res;
      } else {
        throw new Error(resJSON.message || "Erro ao inserir aula");
      }
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      return false;
    }
  };

  useEffect(() => {
    if (!instrutor || !data) return;
    buscarAulasInstrutor(instrutor, data);
  }, [instrutor, data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const id = sessionStorage.getItem("id_autoescola");
        setAutoescola_id(id);
      } catch {
        setAutoescola_id(null);
      }
    }
  }, []);

  const deleteAula = async (id) => {
    try {
      const res = await GenericDelete("adm", id, 'removerAula', 'id');
      if (res?.message) toast.info(res.message);
      await buscarAulasInstrutor(instrutor, data);
    } catch (erro) {
      toast.error(erro.message || erro.toString());
    }
  };

  const alterarAula = async (id1, hora1, id_instruto1, id2, hora2, id_instruto2) => {
    try {
      const att = `?id1=${id1}&hora1=${hora1}&id_instruto1=${id_instruto1}&id2=${id2}&hora2=${hora2}&id_instruto2=${id_instruto2}`;
      const response = await GenericPath('aulas', 'trocarHorarios', att);

      if (response?.sucesso) {
        toast.success("Aula alterada com sucesso!");
        return true;
      } else {
        toast.error("Erro: os veículos ou alunos estão em horários iguais.");
        return false;
      }
    } catch (erro) {
      toast.error(erro.message || erro.toString());
      return false;
    } finally {
      console.log(instrutor);
      console.log(data);

      await buscarAulasInstrutor(instrutor, data);
    }
  };

  return {
    setInstrutor,
    instrutor,
    data,
    autoescola_id,
    setData,
    aulas,
    loading,
    vagas,
    deleteAula,
    buscarAulasInstrutor,
    buscarHorariosLivres,
    InsertClass,
    alterarAula,
    testAulas,
  };
}
