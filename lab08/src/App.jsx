import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Acesso from "./Acesso.jsx";

const Stack = createNativeStackNavigator();
const linking = {
  prefixes: [],
  config: {
    screens: {
      Login: "login",
      Cadastro: "cadastro",
      Jogos: "jogos",
      Adivinhacao: "adivinhacao",
      PedraPapelTesoura: "pedra-papel-tesoura",
    },
  },
};

const opcoes = ["Pedra", "Papel", "Tesoura"];

function numeroAleatorio() {
  return Math.floor(Math.random() * 101);
}

function Adivinhacao({ navigation }) {
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
    <main>
      <button onClick={() => navigation.goBack()}>Voltar para jogos</button>
      <section>
        <h2>Adivinhação</h2>
        <p>Tente descobrir o número gerado pelo computador.</p>
        <form onSubmit={tentar}>
          <input
            type="number"
            aria-label="Seu palpite entre 0 e 100"
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
    </main>
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

function PedraPapelTesoura({ navigation }) {
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
    <main>
      <button onClick={() => navigation.goBack()}>Voltar para jogos</button>
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
    </main>
  );
}

function Jogos({ navigation, aoSair }) {
  return (
    <main>
      <h1>Jogos</h1>
      <p>Escolha o que deseja jogar:</p>
      <nav>
        <button onClick={() => navigation.navigate("Adivinhacao")}>Adivinhação</button>
        <button onClick={() => navigation.navigate("PedraPapelTesoura")}>Pedra, papel e tesoura</button>
      </nav>
      <button onClick={aoSair}>Sair</button>
    </main>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#fff" } }}>
        {usuario ? (
          <>
            <Stack.Screen name="Jogos">
              {(props) => <Jogos {...props} aoSair={() => setUsuario(null)} />}
            </Stack.Screen>
            <Stack.Screen name="Adivinhacao" component={Adivinhacao} />
            <Stack.Screen name="PedraPapelTesoura" component={PedraPapelTesoura} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <Acesso {...props} aoEntrar={setUsuario} />}
            </Stack.Screen>
            <Stack.Screen name="Cadastro">
              {(props) => <Acesso {...props} cadastro />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
