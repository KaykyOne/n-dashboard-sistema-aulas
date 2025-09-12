"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Sidebar({ siderbarVisivel, setSiderbarVisivel }) {
  const [selectedPage, setSelectedpage] = useState("");
  const path = usePathname();

  useEffect(() => {
    const pathFormat = path.replace("/", "");
    console.log(pathFormat);
    setSelectedpage(pathFormat);
  }, [path]); // ✅ Executa só quando a URL muda

  const cssPadrao = "text-sm flex text-gray-200 items-center gap-2 p-4 hover:font-bold group";
  const cssSelecionado = "flex items-center gap-2 p- w-full font-bold group bg-white rounded-full text-primary p-4";

  const cssIconePadrao = "material-icons group-hover:scale-120 transition-all duration-150 group-hover:-rotate-6";
  const classTextResponsive = "";

  return (
    <aside className={`bg-linear-65 from-primary to-[#540843] flex flex-col h-full p-4 shadow-md overflow-hidden fixed md:relative z-50 md:max-w-[300px] ${!siderbarVisivel ? "classe-fechar-esquerdo" : "classe-aparecer-esquerdo text-white"}`}>
      <div className="flex justify-between">
        <div className="flex justify-start items-center py-4 gap-2">
          <img className="rounded-sm w-[40px] h-[40px]" src={`/NovusCFC.png`} alt="Logo da Autoescola" />
          <h1 className={`font-medium ${classTextResponsive}`}>NovusCFC</h1>
        </div>

        <button
          onClick={() => setSiderbarVisivel(!siderbarVisivel)}
          className="cursor-pointer transition duration-150 hover:scale-135 md:hidden">
          <span className={`material-icons ${siderbarVisivel ? 'rotate-180' : 'rotate-0'}`}>
            close
          </span>
        </button>
      </div>


      <nav className="mt-4 space-y-1">

        <Link href="/inicio" className={selectedPage === "inicio" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>home</i>
          <p className={classTextResponsive}> Inicio </p>
        </Link>

        <h1 className="uppercase text-md font-semibold mt-4 mb-3">Pessoal</h1>
        <Link href="/veiculos" className={selectedPage === "veiculos" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>directions_car</i>
          <p className={classTextResponsive}>Veículos</p>
        </Link>

        <Link href="/instrutores" className={selectedPage === "instrutores" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>group</i>
          <p className={classTextResponsive}>Instrutores</p>
        </Link>

        <Link href="/alunos" className={selectedPage === "alunos" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>person</i>
          <p className={classTextResponsive}>Alunos</p>
        </Link>

        <h1 className="uppercase text-md font-semibold mt-4 mb-3">Serviços</h1>
        <Link href="/financeiro" className={selectedPage === "financeiro" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>payments</i>
          <p className={classTextResponsive}>Financeiro</p>
        </Link>

        <Link href="/aulas" className={selectedPage === "aulas" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>school</i>
          <p className={classTextResponsive}>Aulas</p>
        </Link>

        <Link href="/transferencia" className={selectedPage === "transferencia" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>cloud_sync</i>
          <p className={classTextResponsive}>Transferência</p>
        </Link>

        <h1 className="uppercase text-md font-semibold mt-4 mb-3">Ajustes</h1>

        <Link href="/configuracoes" className={selectedPage === "configuracoes" ? cssSelecionado : cssPadrao}>
          <i className={cssIconePadrao}>settings</i>
          <p className={classTextResponsive}>Configurações</p>
        </Link>
      </nav>

      <div className="flex flex-col">
        <Link href="/aulas/novaAula">
          <Button className="w-full mt-3" variant={"alert"}>
            <p className={classTextResponsive}>Nova Aula</p>
            <span className="material-icons">add</span>
          </Button>
        </Link>
        <Link href="/mensagens">
          <Button className="w-full mt-3" variant={"alert"}>
            <p className={classTextResponsive}>Mensagens</p>
            <span className="material-icons">message</span>
          </Button>
        </Link>
      </div>

    </aside>
  );
}
