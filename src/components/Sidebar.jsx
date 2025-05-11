"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../imgs/NovusCFC.png";
import desenho from "../imgs/DesenhoMenu.png";
import { Button } from "./ui/button";
import Modal from "../components/Modal";
import FormNovoAluno from "./forms/FormNovoAluno";
import { usePathname  } from "next/navigation";

export default function Sidebar() {
  const [selectedPage, setSelectedpage] = useState("");
  const path = usePathname();

  useEffect(() => {
    setSelectedpage(path);
  })

  const cssPadrao = "flex items-center gap-2 p-2 rounded-lg hover:text-[#6F0A59] hover:font-bold";
  const cssSelecionado = "flex items-center gap-2 p-2 rounded-lg w-full text-[#6F0A59] font-bold bg-gray-200 border-solid";

  return (
    <aside className="w-64 bg-white h-screen p-4 shadow-md fixed left-0 top-0">
      <div className="flex justify-center items-center py-4 align-middle gap-2">
        <Image className="rounded-sm" src={logo} alt="Logo da Autoescola" width={40} height={40} />
        <h1 className="font-medium">NovusCFC</h1>
      </div>

      <nav className="mt-4 space-y-2">
        <Link onClick={() => setSelectedpage("/inicio")} href="/inicio" className={selectedPage === "/inicio" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">home</i>
          Início
        </Link>

        <Link onClick={() => setSelectedpage("/veiculos")} href="/veiculos" className={selectedPage === "/veiculos" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">directions_car</i>
          Veículos
        </Link>

        <Link onClick={() => setSelectedpage("/instrutores")} href="/instrutores" className={selectedPage === "/instrutores" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">group</i>
          Instrutores
        </Link>

        <Link onClick={() => setSelectedpage("/alunos")} href="/alunos" className={selectedPage === "/alunos" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">person</i>
          Alunos
        </Link>

        <Link onClick={() => setSelectedpage("/financeiro")} href="/financeiro" className={selectedPage === "/financeiro" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">payments</i>
          Financeiro
        </Link>

        <Link onClick={() => setSelectedpage("/aulas")} href="/aulas" className={selectedPage === "/aulas" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">school</i>
          Aulas
        </Link>

        <Link onClick={() => setSelectedpage("/configuracoes")} href="/configuracoes" className={selectedPage === "/configuracoes" ? cssSelecionado : cssPadrao}>
          <i className="material-icons">settings</i>
          Configurações
        </Link>
      </nav>

      <Link href="/aulas/novaAula">
        <Button className="w-full mt-3" onClick={() => setSelectedpage("/novaAula")}>
          Nova Aula
          <span className="material-icons">add</span>
        </Button>
      </Link>

      <div className="mt-15 flex justify-center items-center pb-4">
        <Image src={desenho} alt="Desenho do menu lateral" width={200} height={100} />
      </div>
    </aside>
  );
}
