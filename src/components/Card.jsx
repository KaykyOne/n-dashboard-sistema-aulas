import React from "react";
export function Card({ titulo, valor, corBg, corTexto }) {
  const [visivel, setVisivel] = React.useState(false);

  const css = `${corBg} p-4 rounded-md ${corTexto} anim-hover`;

  return (
    <div className={css} onClick={() => setVisivel(!visivel)}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">{titulo}</h1>
        <button>
          <span className="material-icons cursor-pointer">remove_red_eye</span>
        </button>
      </div>
      <h1 className="text-2xl font-bold">
        {visivel ? valor : "*******"}
      </h1>
    </div>
  );
}
