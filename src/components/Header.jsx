"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export default function Header({ setSiderbarVisivel, siderbarVisivel }) {
  const [tempo, setTempo] = useState('');

  useEffect(() => {
    const horaFim = localStorage.getItem("horaFim");
    if (!horaFim) return;

    const fim = parseInt(horaFim);

    const intervalo = setInterval(() => {
      const agora = Date.now();
      const diferenca = fim - agora;
      if (diferenca <= 0) {
        clearInterval(intervalo);
        setTempo("00:00");
        redirect("/");
        return;
      }

      const minutos = Math.floor(diferenca / 60000);
      const segundos = Math.floor(diferenca % 60000 / 1000);

      const tempoFormatado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
      setTempo(tempoFormatado);

    }, 1000);
    format(intervalo, 'MM:ss')
    setTempo(intervalo);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <header className="bg-white flex items-center justify-between px-6 h-20 w-full shadow-sm rounded-bl-2xl">
      <button
        onClick={() => setSiderbarVisivel(!siderbarVisivel)}
        className="cursor-pointer transition duration-150 hover:scale-135 ml-5">
        <span className={`material-icons ${siderbarVisivel ? 'rotate-180' : 'rotate-0'}`}>
          menu_open
        </span>
      </button>
      <h1 className="text-[#6F0A59]  lg:text-2xl font-light">Autoescola</h1>

      <div className="md:flex gap-3 items-center">
        <h2 className="mr-4">Tempo: {tempo}</h2>
        <Link href="/">
          <Button className="text-white px-4 py-2">
            Sair
            <span className="material-icons">logout</span>
          </Button>
        </Link>
      </div>

    </header>
  );
}
