import { useEffect, useState } from "react";

export default function useAula() {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vagas, setVagas] = useState([]);
    const [instrutor, setInstrutor] = useState();
    const [data, setData] = useState(new Date());

    useEffect(() => {
        async function buscarAulasInstrutor(id, data) {
            
            //console.log(id, data);
            if (!id || !data) return;
            
            try {
                setLoading(true);
                const [res1, res2] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarAulasDoDiaInstrutor?id=${id}&data=${data}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarHorariosVagos?id=${id}&data=${data}`)
                ])
                //console.log("aqui vem as aulas");
                //console.log(res1);
                //console.log("aqui vem as vagas");
                //console.log(res2);

                const aulas = await res1.json();
                const vagas = await res2.json();         
                //console.log(aulas);
                //console.log(vagas);       

                setAulas(aulas);
                setVagas(vagas);
                return;
            } catch (error) {
                console.error('Erro ao buscar aulas:', error);
                setAulas([]);
            } finally {
                setLoading(false);
            }
        }
        buscarAulasInstrutor(instrutor, data)
    }, [instrutor, data])



    return { setInstrutor, instrutor, data, setData, aulas, loading, vagas };
}

