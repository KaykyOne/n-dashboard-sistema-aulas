"use client";
import { useState, useEffect } from "react";


export default function page() {
  const [mensagemDiaria, setMensagemDiaria] = useState('');

  const listas = [
    "Manter o equilíbrio das aulas na mão do sistema.",
    "Não seguir totalmente a vontade dos alunos, aqui é você que manda!",
    "A intervenção pode levar a falhas.",
    "Use o sistema sempre pensando no bem da autoescola, e não na vontade dos alunos!"
  ]

  const dicas = [
    "Aulas de mais podem dar vantagens indesejadas!",
    "Não ataque o paquistão ;)",
    "Manter uma rotina previsível é o melhor a se fazer!"
  ]

  let verLista = listas.map(function (element) {
    return <li key={element}>{element}</li>
  })

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    let res = getRandomInt(0, dicas.length);
    setMensagemDiaria(dicas[res])
  }, [])

  return (
    <div className="flex flex-col w-full gap-4 text-[#6F0A59]">
      <div className="grid lg:grid-cols-2 p-10 bg-white anim-hover">
        <div className="flex flex-col text-[#6F0A59] text-start p-3 justify-center">
          <h1 className="font-bold text-6xl">Bem-Vindo</h1>
          <h3>Aproveite nosso sistema!</h3>

          <h4 className="text-2xl font-medium">Feito por NovusTech</h4>
        </div>
        <img alt="Imagem Tranquila" className="flex flex-1 opacity-50" src={`/DesenhoTranquilidade.svg`} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col bg-white p-5 anim-hover">
          <h2 className="font-bold text-2xl">Frase do Dia:</h2>
          <h1 className="font-light text-4xl">{mensagemDiaria}</h1>
        </div>
        <div className="flex flex-col bg-white p-5 text-start anim-hover">
          <h2 className="font-bold text-2xl">Dicas de uso:</h2>
          <ul className="list-disc ml-5">
            {verLista}
          </ul>
        </div>
      </div>
    </div>
  );
}
