"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const usuarios = [
  { id: 1, nome: "João Silva", email: "joao@email.com" },
  { id: 2, nome: "Maria Souza", email: "maria@email.com" },
  { id: 3, nome: "Carlos Pereira", email: "carlos@email.com" },
];

export default function AlunosPage() {
  const [search, setSearch] = useState("");

  const usuariosFiltrados = usuarios.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-4">

      <div className="row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="row-span-1 grid grid-cols-1 gap-4" >
          <div className="p-6 row-span-1 bg-white rounded-sm" >
            <h1><strong>Total</strong> de Alunos Ativos:</h1>
            <h1 className="font-bold text-7xl">400</h1>
          </div>
          <div className="p-6 row-span-1 bg-white rounded-sm" >
            <h1>Relação <strong>Aluno</strong> x <strong>Instrutor</strong>:</h1>
            <h1 className="font-bold text-7xl">80</h1>
          </div>
        </div>

        <div className="p-6 row-span-1 bg-white rounded-sm" >
          <h1>Média de novos <strong>Alunos</strong> por Mês</h1>
          <h1 className="font-bold text-9xl">25</h1>
          <div className="border-2 border-solid border-black">
            <div style={{ width: "80%" }} className="bottom-0 h-5 bg-[#6F0A59]" />
          </div>
        </div>
      </div>

      <div className="p-6 row-span-2 bg-white rounded-sm">
        {/* Barra de pesquisa */}
        <Input
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full"
        />

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}
