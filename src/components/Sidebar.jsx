"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [selectedPage, setSelectedpage] = useState("");
  const path = usePathname();

  useEffect(() => {
    setSelectedpage(path);
  }, [path]); // ✅ Executa só quando a URL muda

  const cssPadrao = "flex items-center gap-2 p-2 hover:text-[#6F0A59] hover:font-bold";
  const cssSelecionado = "flex items-center gap-2 p-2 w-full text-[#6F0A59] font-bold border-2 border-white border-l-[#6F0A59]";

  const classTextResponsive = "hidden lg:inline";

  return (
    <aside className=" bg-white h-screen p-4 shadow-md fixed left-0 top-0 overflow-hidden lg:w-[230px]">
      <div className="flex justify-start items-center py-4 gap-2">
        <img className="rounded-sm w-[40px] h-[40px]" src={`/NovusCFC.png`} alt="Logo da Autoescola" />
        <h1 className={`font-medium ${classTextResponsive}`}>NovusCFC</h1>
      </div>

      <nav className="mt-4 space-y-2">
        <Link href="/inicio" className={selectedPage === "/inicio" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">home</i>
          <p className={classTextResponsive}> Início </p>
        </Link>

        <Link href="/veiculos" className={selectedPage === "/veiculos" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">directions_car</i>
          <p className={classTextResponsive}>Veículos</p>
        </Link>

        <Link href="/instrutores" className={selectedPage === "/instrutores" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">group</i>
          <p className={classTextResponsive}>Instrutores</p>
        </Link>

        <Link href="/alunos" className={selectedPage === "/alunos" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">person</i>
          <p className={classTextResponsive}>Alunos</p>
        </Link>

        <Link href="/financeiro" className={selectedPage === "/financeiro" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">payments</i>
          <p className={classTextResponsive}>Financeiro</p>
        </Link>

        <Link href="/aulas" className={selectedPage === "/aulas" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">school</i>
          <p className={classTextResponsive}>Aulas</p>
        </Link>

        <Link href="/configuracoes" className={selectedPage === "/configuracoes" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">settings</i>
          <p className={classTextResponsive}>Configurações</p>
        </Link>

        <Link href="/transferencia" className={selectedPage === "/transferencia" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">cloud_sync</i>
          <p className={classTextResponsive}>Transferência</p>
        </Link>
      </nav>

      <div className="flex flex-col">
        <Link href="/aulas/novaAula">
          <Button className="w-full mt-3">
            <p className={classTextResponsive}>Nova Aula</p>
            <span className="material-icons">add</span>
          </Button>
        </Link>
        <Link href="/mensagens">
          <Button className="w-full mt-3">
            <p className={classTextResponsive}>Mensagens</p>
            <span className="material-icons">message</span>
          </Button>
        </Link>
      </div>

    </aside>
  );
}
