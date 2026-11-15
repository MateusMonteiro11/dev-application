import { useEffect, useId, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIOS = "@mini_jogos:usuarios";

export default function Acesso({ cadastro = false, navigation, route, aoEntrar }) {
  const emailId = useId();
  const senhaId = useId();
  const [email, setEmail] = useState(route.params?.email ?? "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setEmail(route.params?.email ?? "");
    setSenha("");
  }, [route.params?.email, route.params?.mensagem]);

  async function enviar(evento) {
    evento.preventDefault();
    const emailNormalizado = email.trim().toLowerCase();
    setErro("");

    if (!emailNormalizado || !senha.trim()) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    try {
      const dados = await AsyncStorage.getItem(CHAVE_USUARIOS);
      const usuarios = dados ? JSON.parse(dados) : [];
      const usuario = usuarios.find((item) => item.email === emailNormalizado);

      if (cadastro) {
        if (usuario) {
          setErro("Este e-mail já está cadastrado.");
          return;
        }

        await AsyncStorage.setItem(
          CHAVE_USUARIOS,
          JSON.stringify([...usuarios, { email: emailNormalizado, senha }]),
        );
        navigation.reset({
          index: 0,
          routes: [{
            name: "Login",
            params: {
              email: emailNormalizado,
              mensagem: "Cadastro realizado! Faça login para jogar.",
            },
          }],
        });
      } else if (usuario && usuario.senha === senha) {
        aoEntrar(usuario.email);
      } else {
        setErro("E-mail ou senha incorretos.");
      }
    } catch {
      setErro("Não foi possível acessar os cadastros. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1>Mini jogos</h1>
      <section className="acesso">
        <h2>{cadastro ? "Cadastro" : "Login"}</h2>
        <p>{cadastro ? "Crie sua conta para jogar." : "Entre na sua conta para escolher um jogo."}</p>
        {route.params?.mensagem && <p role="status">{route.params.mensagem}</p>}
        <form onSubmit={enviar}>
          <fieldset disabled={carregando}>
            <label htmlFor={emailId}>E-mail</label>
            <input
              id={emailId}
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              required
            />
            <label htmlFor={senhaId}>Senha</label>
            <input
              id={senhaId}
              type="password"
              autoComplete={cadastro ? "new-password" : "current-password"}
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              required
            />
            {erro && <p className="erro" role="alert">{erro}</p>}
            <button type="submit">
              {carregando ? "Aguarde..." : cadastro ? "Cadastrar" : "Entrar"}
            </button>
          </fieldset>
        </form>
        <button
          type="button"
          onClick={() => {
            if (!cadastro) navigation.navigate("Cadastro");
            else if (navigation.canGoBack()) navigation.goBack();
            else navigation.replace("Login");
          }}
          disabled={carregando}
        >
          {cadastro ? "Voltar para login" : "Criar conta"}
        </button>
      </section>
    </main>
  );
}
