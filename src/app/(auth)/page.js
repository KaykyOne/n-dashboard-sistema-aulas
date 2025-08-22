"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/useLogin";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const LoginImage = () => (
  <div className="flex justify-center overflow-hidden">
    <img
      src={`/imagemLogin.png`}
      alt="imagem do login"
      className="flex-1"
    />
  </div>
);

const LoginForm = ({ loginState }) => {
  const { cpf, login, senha, setCpf, setSenha, salvar, setSalvar, loading } = loginState;

  useEffect(() => {
    const cpf = localStorage.getItem("cpf");
    const senha = localStorage.getItem("senha");

    if (cpf && senha) {
      setCpf(cpf);
      setSenha(senha);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-6 text-center gap-2">
      <img
        src={`/NovusCFC.png`}
        alt="logo da empresa"
        className="w-auto h-auto"
      />
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Input
        placeholder={"CPF"}
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <Input
        placeholder={"Senha"}
        type={"password"}
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <div className="flex gap-2 cursor-pointer">
        <input type="checkbox" className="cursor-pointer" id="check" name="checkbox" checked={salvar} onChange={(e) => setSalvar(e.target.checked)} />
        <label className="cursor-pointer" htmlFor="check">Salvar Acesso</label>
      </div>
      <Button className="w-full" onClick={login} disabled={loading}>
        {!loading ? (
          <>
            <span className="material-icons">logout</span>
            Fazer Login
          </>
        ) : (
          <div className="w-5 h-5 border-4  border-t-transparent rounded-full animate-spin"></div>
        )}

      </Button>
    </div>
  );
};

export default function Page() {
  const loginState = useLogin();
  const { loading, confirmado } = loginState;
  const router = useRouter();

  useEffect(() => {
    if (confirmado.usuario_id > 0) {
      localStorage.setItem("dados", confirmado.autoescola_id);
      if (confirmado.tipo_usuario === "superadm") {
        router.push('/autoescolas');
      } else if (confirmado.tipo_usuario === "adm") {
        localStorage.setItem("id_autoescola", confirmado.autoescola_id);
        router.push('/inicio');
      }
    }
  }, [confirmado]);

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <div className="flex gap-2 p-3 w-full justify-start flex-1">
        <div className="flex gap-2 h-fit items-center">
          <div className="flex flex-col">
            <h1 className="text-lg font-medium m-0 leading-tight">NovusTech</h1>
            <p className="text-[9px] m-0 leading-tight">Inovação e organização!</p>
          </div>
          <img
            src={`/NovusTech.png`}
            alt="logo da empresa"
            className="w-[30px] h-[30px] rounded-sm"
          />
        </div>
      </div>
      <div className="bg-white grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full h-full md:h-[500px] rounded-lg shadow-lg overflow-hidden">
        <LoginForm loginState={loginState} />
        <LoginImage />
      </div>
      <div className="flex p-3 w-full justify-start  flex-1">

      </div>
    </div>
  );
}
