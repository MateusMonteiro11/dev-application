import { useState } from "react";

export function App() {
  const [numeroSecreto] = useState(() => Math.floor(Math.random() * 100));
  const [palpite, setPalpite] = useState("");
  const [resultado, setResultado] = useState({
    mensagem: "Tente Adivinhar",
    tipo: "inicial",
  });

  function verificarPalpite(event) {
    event.preventDefault();
    const numero = Number(palpite);

    if (
      palpite.trim() === "" ||
      !Number.isInteger(numero) ||
      numero < 0 ||
      numero > 99
    ) {
      setResultado({ mensagem: "Digite um número de 0 a 99", tipo: "erro" });
    } else if (numero > numeroSecreto) {
      setResultado({ mensagem: "Número grande", tipo: "erro" });
    } else if (numero < numeroSecreto) {
      setResultado({ mensagem: "Número pequeno", tipo: "erro" });
    } else {
      setResultado({ mensagem: "Parabéns, número correto", tipo: "acerto" });
    }
  }

  return (
    <main className="jogo" aria-label="Jogo de adivinhação">
      <form onSubmit={verificarPalpite} noValidate>
        <input
          type="number"
          min="0"
          max="99"
          step="1"
          inputMode="numeric"
          aria-label="Digite um número de 0 a 99"
          value={palpite}
          onChange={(event) => setPalpite(event.target.value)}
        />
        <button type="submit">Clique Aqui</button>
      </form>

      <h1 className={`mensagem ${resultado.tipo}`} role="status" aria-live="polite">
        {resultado.mensagem}
      </h1>
    </main>
  );
}
