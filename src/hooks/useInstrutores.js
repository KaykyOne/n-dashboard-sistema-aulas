import React, { useState, useEffect } from 'react'

export default function useInstrutores() {
    const [loading, setLoading] = useState(false);
    const [instrutores, setInstrutores] = useState([]);


    async function buscarInstrutores(autoescola_id) { 
        if(autoescola_id === 0) return;
        setLoading(true);
        try{
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/buscarTodosInstrutores?autoescola_id=${autoescola_id}`);
            let respostaJson = await res.json();
            console.log(respostaJson);
            setInstrutores(respostaJson);
        }catch(error){
            console.error(`erro ao buscar isntrutores: ${error}`);
        }finally{
            setLoading(false);
        }
    }

    async function mudarAtividadeInstrutor(id_instrutor) {
        setLoading(true);
        try{

        }catch(error){
            console.error(`erro ao mudar atividade isntrutor: ${error}`);
        }finally{
            setLoading(false);
        }
    }

    return {buscarInstrutores, mudarAtividadeInstrutor, loading, instrutores};
}
