"use client"; 

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const usuarios = [
  { id: 1, nome: "João Silva", email: "joao@email.com" },
  { id: 2, nome: "Maria Souza", email: "maria@email.com" },
  { id: 3, nome: "Carlos Pereira", email: "carlos@email.com" },
];

export default function Dashboard() {
  return(
    <h1>Bem-Vindo</h1>
  );
}
