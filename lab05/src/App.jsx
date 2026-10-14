import { useState } from "react";

const opcoes = ["Pedra", "Papel", "Tesoura"];

function numeroAleatorio() {
  return Math.floor(Math.random() * 101);
}

function Adivinhacao() {
  const [segredo, setSegredo] = useState(numeroAleatorio);
  const [palpite, setPalpite] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState("Digite um número entre 0 e 100.");
  const [finalizado, setFinalizado] = useState(false);

  function tentar(evento) {
    evento.preventDefault();
    const numero = Number(palpite);

    if (!Number.isInteger(numero) || numero < 0 || numero > 100) {
      setMensagem("Digite um número válido entre 0 e 100.");
      return;
    }

    setTentativas((total) => total + 1);
    setPalpite("");

    if (numero === segredo) {
      setMensagem(`Você acertou! O número era ${segredo}.`);
      setFinalizado(true);
    } else {
      setMensagem(numero < segredo ? "O número secreto é maior." : "O número secreto é menor.");
    }
  }

  function reiniciar() {
    setSegredo(numeroAleatorio());
    setPalpite("");
    setTentativas(0);
    setMensagem("Digite um número entre 0 e 100.");
    setFinalizado(false);
  }

  return (
    <section>
      <h2>Adivinhação</h2>
      <p>Tente descobrir o número gerado pelo computador.</p>
      <form onSubmit={tentar}>
        <input
          type="number"
          min="0"
          max="100"
          value={palpite}
          onChange={(evento) => setPalpite(evento.target.value)}
          disabled={finalizado}
          required
        />
        <button disabled={finalizado}>Tentar</button>
      </form>
      <p>{mensagem}</p>
      <p>Tentativas: {tentativas}</p>
      <button onClick={reiniciar}>Reiniciar</button>
    </section>
  );
}

function jogadaDoComputador() {
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function resultadoDaRodada(jogador, computador) {
  if (jogador === computador) return "empate";

  const venceu =
    (jogador === "Pedra" && computador === "Tesoura") ||
    (jogador === "Papel" && computador === "Pedra") ||
    (jogador === "Tesoura" && computador === "Papel");

  return venceu ? "vitoria" : "derrota";
}

function PedraPapelTesoura() {
  const [rodada, setRodada] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [empates, setEmpates] = useState(0);
  const [mensagem, setMensagem] = useState("Escolha uma jogada.");
  const [resultadoFinal, setResultadoFinal] = useState("");

  function jogar(escolha) {
    if (rodada === 5) return;

    const computador = jogadaDoComputador();
    const resultado = resultadoDaRodada(escolha, computador);
    const proximaRodada = rodada + 1;
    let novasVitorias = vitorias;
    let novasDerrotas = derrotas;

    if (resultado === "empate") {
      setEmpates((total) => total + 1);
      setMensagem(`Empate! Ambos escolheram ${escolha}.`);
    } else if (resultado === "vitoria") {
      novasVitorias += 1;
      setVitorias(novasVitorias);
      setMensagem(`Você ganhou! O computador escolheu ${computador}.`);
    } else {
      novasDerrotas += 1;
      setDerrotas(novasDerrotas);
      setMensagem(`Você perdeu! O computador escolheu ${computador}.`);
    }

    setRodada(proximaRodada);

    if (proximaRodada === 5) {
      if (novasVitorias > novasDerrotas) setResultadoFinal("Você venceu a partida!");
      else if (novasVitorias < novasDerrotas) setResultadoFinal("O computador venceu a partida!");
      else setResultadoFinal("A partida terminou empatada!");
    }
  }

  function reiniciar() {
    setRodada(0);
    setVitorias(0);
    setDerrotas(0);
    setEmpates(0);
    setMensagem("Escolha uma jogada.");
    setResultadoFinal("");
  }

  return (
    <section>
      <h2>Pedra, papel e tesoura</h2>
      <p>Escolha uma opção. A partida possui 5 rodadas.</p>
      <div className="placar">
        <span>Vitórias: {vitorias}</span>
        <span>Derrotas: {derrotas}</span>
        <span>Empates: {empates}</span>
        <span>Rodada: {rodada}/5</span>
      </div>
      <div className="opcoes">
        {opcoes.map((opcao) => (
          <button key={opcao} onClick={() => jogar(opcao)} disabled={rodada === 5}>
            {opcao}
          </button>
        ))}
      </div>
      <p>{mensagem}</p>
      {resultadoFinal && <p className="resultado-final">{resultadoFinal}</p>}
      <button onClick={reiniciar}>Reiniciar partida</button>
    </section>
  );
}

export default function App() {
  const [jogo, setJogo] = useState("adivinhacao");

  return (
    <main>
      <h1>Jogos</h1>
      <nav>
        <button onClick={() => setJogo("adivinhacao")}>Adivinhação</button>
        <button onClick={() => setJogo("pedra-papel-tesoura")}>Pedra, papel e tesoura</button>
      </nav>
      {jogo === "adivinhacao" ? <Adivinhacao /> : <PedraPapelTesoura />}
    </main>
  );
}
