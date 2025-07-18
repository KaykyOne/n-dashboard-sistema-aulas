import React from 'react'
import { Button } from './ui/button'

const exportPDF = () => {
    const printContent = document.getElementById("print-area");
    if (!printContent) return;
    printContent.style.display = 'block'
    const win = window.open("", "", "width=800,height=600");
    if (!win) return;

    win.document.write(`
    <html>
      <head>
        <title>Impressão</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 20px;
          }
        </style>
         <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `);

    win.document.close();

    win.focus();

    win.onload = () => {
        win.print(); // abre a janelinha padrão de impressão
        win.close(); // fecha depois
    };
};

export default function Imprimir({ children }) {
    return (
        <div className='flex flex-col'>
            <Button className={'w-fit'} onClick={() => exportPDF()}>
                Imprimir
                <span className="material-icons">
                    newspaper
                </span>
            </Button>

            <div style={{ display: 'none' }}>
                {children}
            </div>
        </div>
    )
}
