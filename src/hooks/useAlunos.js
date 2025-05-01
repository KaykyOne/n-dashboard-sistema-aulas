import React, {useState, useEffect} from 'react'

export default function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [ loading, setLoading] = useState(false);

    async function buscarAlunos(autoescola_id) {
        if(autoescola_id === 0) return;
        setLoading(true);
        try{
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarTodosAlunos?autoescola_id=${autoescola_id}`);
            let respostaJson = await res.json();
            console.log(respostaJson);
            setAlunos(respostaJson);
        }catch(error){
            console.error(`erro ao buscar isntrutores: ${error}`);
        }finally{
            setLoading(false);
        }
    }
  return {buscarAlunos, alunos, loading}
}
