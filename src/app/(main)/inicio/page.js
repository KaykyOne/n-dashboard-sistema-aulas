"use client";
import { useState, useEffect } from "react";
import {
  format,
  getMonth,
  getYear
} from "date-fns";
import { Combobox } from "@/components/ui/combobox";
import useAlunos from "@/hooks/useAlunos";

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

const opcoesMes = [
  { value: "0", label: "Janeiro" },
  { value: "1", label: "Fevereiro" },
  { value: "2", label: "Março" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Maio" },
  { value: "5", label: "Junho" },
  { value: "6", label: "Julho" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Setembro" },
  { value: "9", label: "Outubro" },
  { value: "10", label: "Novembro" },
  { value: "11", label: "Dezembro" },
]

export default function page() {

  const mesHoje = getMonth(new Date());
  const [mesSelecionado, setMesSelecionado] = useState(0);
  const { buscarAlunos, alunos } = useAlunos();

  useEffect(() => {
    const buscar = async () => {
      await buscarAlunos();
    };

    buscar();
  }, [])

  useEffect(() => {
    setMesSelecionado(mesHoje);
  }, [alunos])

  const searchAlunos = (mes = "", tipo = "") => {
    if (!alunos || alunos.length == 0) return 0;
    let alunosFiltrados = alunos
      .filter(item => item.atividade === true)
      .filter(item => getYear(item.data_cadastro) == getYear(new Date()));

    if (tipo != "") {
      alunosFiltrados = alunosFiltrados.filter(item =>
        (item.categoria_pretendida || "").toLowerCase().includes((tipo || "").toLowerCase())
      );
    }

    if (mes != "") {
      alunosFiltrados = alunosFiltrados.filter(item => getMonth(item.data_cadastro) == mes)
    }

    return alunosFiltrados.length || 0;
  }



  return (
    <div className="flex flex-col w-full gap-4 text-[#6F0A59]">
      <Combobox
        placeholder="Mês..."
        options={opcoesMes}
        value={mesSelecionado}
        onChange={setMesSelecionado}
      />

      <div className="flex flex-wrap gap-3">
        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-500">
              Novos Alunos
            </h2>
            <p className="text-xs text-gray-400">
              Primeira Habilitação • Mês de {meses[mesSelecionado]}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {searchAlunos(mesSelecionado, 'ab')}
          </div>
        </div>

        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-500">
              Novos Alunos
            </h2>
            <p className="text-xs text-gray-400">
              Categoria D • Mês de {meses[mesSelecionado]}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {searchAlunos(mesSelecionado, 'd')}
          </div>
        </div>


        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-500">
              Novos Alunos
            </h2>
            <p className="text-xs text-gray-400">
              Categoria C • Mês de {meses[mesSelecionado]}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {searchAlunos(mesSelecionado, 'c')}
          </div>
        </div>


        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-500">
              Novos Alunos
            </h2>
            <p className="text-xs text-gray-400">
              Categoria E • Mês de {meses[mesSelecionado]}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {searchAlunos(mesSelecionado, 'd')}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div>
            <h2 className="text-xl text-gray-400">Quatidade de novos Alunos em</h2>
            <h1 className="text-5xl font-semibold text-gray-500">{getYear(new Date())}</h1>
          </div>
          <div>
            <h1 className="text-[#6F0A59] font-bold text-3xl">{searchAlunos()}</h1>
          </div>
        </div>

        <div className="card anim-hover flex items-center justify-between gap-5 flex-1">
          <div>
            <h2 className="text-xl text-gray-400">Quatidade de novos Alunos em</h2>
            <h1 className="text-5xl font-semibold text-gray-500">{meses[mesSelecionado]}</h1>
          </div>
          <div>
            <h1 className="text-[#6F0A59] font-bold text-3xl">{searchAlunos(mesSelecionado)}</h1>
          </div>
        </div>
      </div>

    </div>
  );
}
