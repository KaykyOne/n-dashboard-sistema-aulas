import React from "react";

export default function EnvioMensagensPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Envio de Mensagens em Massa
      </h1>

      <p className="text-gray-700 leading-relaxed">
        O que é o envio de mensagens em massa? É uma forma prática de se
        comunicar com vários alunos da sua autoescola de uma vez só. Aqui, você
        poderá conectar seu número do <strong>WhatsApp</strong> e enviar
        mensagens diretamente para os contatos que escolher.
      </p>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
        <p className="text-yellow-800 font-semibold">⚠️ Aviso importante:</p>
        <p className="text-yellow-700 mt-2">
          Embora as mensagens sejam enviadas por um canal seguro, essa prática
          não é autorizada oficialmente pelo WhatsApp. Por isso, evite envios em
          massa com intervalos menores que <strong>1 minuto</strong> para cada
          mensagem, pois isso pode causar o bloqueio do seu número.
        </p>
        <p className="text-yellow-700 mt-2 font-medium">
          A NovusTech não se responsabiliza por bloqueios causados pelo uso
          indevido desta ferramenta.
        </p>
      </div>
    </div>
  );
}
