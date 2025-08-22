import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function useLogin() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [salvar, setSalvar] = useState(true);

  const login = async () => {
    toast.dismiss()
    // Validação simples
    if (!cpf || !senha) {
      toast.error("Preencha CPF e senha corretamente.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adm/login?cpf=${cpf}&&senha=${senha}`);
      if (!res.ok) {
        throw new Error("Credenciais inválidas ou erro no servidor.");
      }

      const data = await res.json();
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        const agora = Date.now();
        const duracao = 30 * 60 * 1000; 
        const fim = agora + duracao;
        localStorage.setItem("horaFim", fim.toString());
      }

      if (salvar) {
        localStorage.setItem("cpf", cpf);
        localStorage.setItem("senha", senha);
      } else {
        localStorage.clear();
      }

      setConfirmado(data.result[0]);
    } catch (error) {
      toast.error(`Erro ao tentar fazer login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    setCpf,
    setSenha,
    loading,
    cpf,
    senha,
    confirmado,
    salvar,
    setSalvar
  };
}
