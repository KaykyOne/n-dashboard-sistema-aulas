import { useState } from 'react';
import { getToken } from '@/lib/utils';
import useGeneric from './useGeneric';
import { toast } from 'react-toastify';

export default function useInstrutores() {

  const { GenericSearch, loading, error } = useGeneric();
  const [instrutores, setInstrutores] = useState([]);

  async function buscarInstrutores(autoescola_id) {
    if (autoescola_id === 0) return;
    const res = await GenericSearch('adm', 'buscarTodosInstrutores', `?autoescola_id=${autoescola_id}`);
    setInstrutores(res);
  }

  async function mudarAtividadeInstrutor(id_instrutor) {
    try {
      const token = getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adm/mudarAtividadeInstrutor?id_instrutor=${id_instrutor}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("Erro ao mudar atividade");

      toast.success("Atividade alterada com sucesso");
    } catch (error) {
      toast.error(`Erro ao mudar atividade do instrutor: ${error}`);
    } 
  }

  return { buscarInstrutores, mudarAtividadeInstrutor, loading, instrutores };
}
