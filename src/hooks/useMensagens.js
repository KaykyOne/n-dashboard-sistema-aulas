"use client"
import { useState } from 'react'
import useGeneric from './useGeneric'
import { toast } from 'react-toastify';

export default function useMensagens() {
    const [usuarios, setUsuarios] = useState([]);
    const { GenericCreate, loading } = useGeneric();

    const inserirMensagem = async (textoMensagem) => {
        try {
            for (let index = 0; index < usuarios.length; index++) {
                const mensagem = {
                    mensagem: textoMensagem,
                    telefone: usuarios[index].telefone
                };
                const { resJSON, res } = await GenericCreate('mensagens', 'inserirMensagem', mensagem) || {};
                console.log(resJSON);
                console.log(res);

                if (!resJSON || !res.ok) {
                    throw new Error(res?.error || "Erro ao inserir mensagem");
                }else{
                    toast.success(`Mensagem número ${index + 1} enviada!`);
                }
            }

        } catch (erro) {
            toast.error(erro.message || erro.toString());
        }
    };

    return {
        inserirMensagem,
        usuarios,
        setUsuarios,
        loading
    };
}
