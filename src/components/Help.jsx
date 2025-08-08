"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Help({ setOpen, open }) {

  const [historico, setHistorico] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const suportePrompt = `
      Você é um assistente virtual de suporte para um sistema de autoescolas. Sua função é responder de forma clara, rápida e informal dúvidas dos usuários sobre o uso do sistema. Sempre que possível, explique o passo a passo de forma simples e direta. 
      Fale como se estivesse explicando pra alguém que não manja muito de tecnologia. Respostas curtas, sem enrolação, mas com detalhes práticos quando necessário. 
      Se for algo que não pode ser resolvido no chat (ex: erro interno), oriente o usuário a entrar em contato com o suporte humano.

      Exemplos de perguntas que você pode responder:
      - Como marcar uma aula?
      - Onde vejo os alunos cadastrados?
      - Como editar o horário do instrutor?
      - O sistema tá travando, o que faço?
      - Como alterar a senha?
      - Como cadastrar um novo veículo?

      Informações e respostas prontas:
      - Como marcar uma aula: Vai em Agendamentos > Nova Aula, escolhe o aluno, o instrutor, o horário e clica em confirmar. Pronto.
      - Erro "Horário ocupado": Isso acontece quando o instrutor ou o aluno já tem uma aula nesse horário. Verifica o calendário antes de agendar.
      - Não consigo logar: Verifica se o e-mail e a senha estão certos. Se esqueceu a senha, clica em Esqueci a Senha na tela de login.
      
      `;

  const perguntarChat = async () => {
    setLoading(true);
    let novoHistorico = historico;

    if (historico.length === 0) {
      novoHistorico = [
        { role: 'system', content: suportePrompt },
        { role: 'user', content: mensagem }
      ];
    } else {
      novoHistorico = [...historico, { role: 'user', content: mensagem }];
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_IA_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: novoHistorico,
        temperature: 0
      })
    });

    const json = await res.json();
    const resposta = json.choices[0].message.content;

    novoHistorico = [...historico, { role: 'assistant', content: resposta }];
    setHistorico(novoHistorico);

    setResposta(resposta);
    setMensagem('');
    setLoading(false);
  };

  const ativerEnter = async (key) => {
    console.log(key);
    if(key.toLowerCase() == "enter" && !loading){
      await perguntarChat();
    }
  }

  return (
    <div className='flex flex-col fixed bg-white h-screen w-[500px] p-6 right-0 z-50 shadow-xl gap-2 classe-aparecer'>
      <Button className='cursor-pointer w-full' onClick={() => setOpen(!open)}>
        Fechar
        <span className="material-icons">
          close
        </span>
      </Button>
      <div className='flex flex-col h-full gap-5'>
        <h1 className='text-center w-ful font-medium text-4xl mt-5'>Suporte</h1>
        <div className='h-full flex flex-col text-xl rounded-2xl border border-gray-300 p-3 overflow-auto'>
          {!loading ? (
            <div className='w-full h-5'>
              <p className='text-lg'>{resposta || ''}</p>
            </div>
          ) : (
            <div className='flex flex-col gap-2 animate-pulse'>
              <div className='w-full h-5 bg-gray-200 rounded-2xl'></div>
              <div className='w-full flex gap-1'>
                <div className='w-1/3 h-5 bg-gray-200 rounded-2xl'></div>
                <div className='w-full h-5 bg-gray-200 rounded-2xl'></div>
              </div>
              <div className='w-full h-5 bg-gray-200 rounded-2xl'></div>
              <div className='w-full flex gap-1'>
                <div className='w-full h-5 bg-gray-200 rounded-2xl'></div>
                <div className='w-1/2 h-5 bg-gray-200 rounded-2xl'></div>
              </div>
            </div>
          )}
        </div>
        <div className='flex gap-2'>
          <Input placeholder={"Pergunte algo..."} onChange={(e) => setMensagem(e.target.value)} value={mensagem} onKeyDown ={(e) => ativerEnter(e.key)} disabled={loading}/>
          <Button onClick={() => perguntarChat()} disabled={loading}>
            <span className="material-icons">
              send
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
